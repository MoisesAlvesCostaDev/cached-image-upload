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

export async function saveImage(
  buffer: Buffer,
  filename: string
): Promise<void> {
  await ensureUploadDirExists();
  const filePath = path.join(uploadDir, filename);
  await fs.writeFile(filePath, buffer);
}

export async function getImage(
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
