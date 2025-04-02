import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import fs from "fs/promises";
import path from "path";
import sharp from "sharp";
import config from "../config";

const uploadDir = path.join(__dirname, "../../", config.upload.uploadDir);

async function ensureUploadDirExists(): Promise<void> {
  try {
    await fs.access(uploadDir);
  } catch {
    await fs.mkdir(uploadDir, { recursive: true });
  }
}

const MIME_TO_EXTENSION: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export async function compressImage(
  file: Express.Multer.File
): Promise<{ buffer: Buffer; extension: string }> {
  const extensionFromMime = MIME_TO_EXTENSION[file.mimetype];
  const extensionFromName = file.originalname.split(".").pop()?.toLowerCase();

  const extension =
    extensionFromMime ||
    (extensionFromName &&
      config.upload.allowedFileExtensions.includes(extensionFromName)
      ? extensionFromName
      : "jpg");

  const compressedBuffer = await sharp(file.buffer)
    .resize(800, 800, { fit: "inside", withoutEnlargement: true })
    .toBuffer();

  return { buffer: compressedBuffer, extension };
}

async function saveImageLocal(
  buffer: Buffer,
  filename: string
): Promise<void> {
  await ensureUploadDirExists();
  const filePath = path.join(uploadDir, filename);
  await fs.writeFile(filePath, buffer);
}

async function getImageLocal(
  filename: string
): Promise<{ buffer: Buffer } | null> {
  try {
    const filePath = path.join(uploadDir, filename);
    const buffer = await fs.readFile(filePath);
    return { buffer };
  } catch (error) {
    return null;
  }
}

const s3Client = new S3Client({
  region: config.s3.region,
  endpoint: config.s3.endpoint,
  credentials: {
    accessKeyId: config.s3.accessKeyId,
    secretAccessKey: config.s3.secretAccessKey,
  },
  forcePathStyle: config.s3.endpoint ? true : false,
});

function getContentType(extension: string): string {
  switch (extension) {
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "webp":
      return "image/webp";
    default:
      return "application/octet-stream";
  }
}

async function saveImageS3(
  buffer: Buffer,
  filename: string
): Promise<void> {
  const ext = filename.split(".").pop()?.toLowerCase() || "";
  const contentType = getContentType(ext);
  const command = new PutObjectCommand({
    Bucket: config.s3.bucketName,
    Key: filename,
    Body: buffer,
    ContentType: contentType,
    ACL: 'public-read',
  });


  await s3Client.send(command);
}

async function getImageS3(
  filename: string
): Promise<{ buffer: Buffer } | null> {
  try {
    const command = new GetObjectCommand({
      Bucket: config.s3.bucketName,
      Key: filename,
    });
    const response = await s3Client.send(command);
    const stream = response.Body;
    if (!stream) return null;

    const streamToBuffer = (stream: NodeJS.ReadableStream): Promise<Buffer> =>
      new Promise((resolve, reject) => {
        const chunks: Buffer[] = [];
        stream.on("data", (chunk) => chunks.push(chunk));
        stream.on("error", reject);
        stream.on("end", () => resolve(Buffer.concat(chunks)));
      });

    const buffer = await streamToBuffer(stream as NodeJS.ReadableStream);
    return { buffer };
  } catch (error) {
    return null;
  }
}

export async function saveImage(
  buffer: Buffer,
  filename: string
): Promise<void> {
  if (config.storage.type === "s3") {
    await saveImageS3(buffer, filename);
  } else {
    await saveImageLocal(buffer, filename);
  }
}

export async function getImage(
  filename: string
): Promise<{ buffer: Buffer } | null> {
  if (config.storage.type === "s3") {
    return await getImageS3(filename);
  } else {
    return await getImageLocal(filename);
  }
}
