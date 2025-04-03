import fs from "fs/promises";
import sharp from "sharp";
import {
  compressImage,
  ensureUploadDirExists
} from "../../../../src/services/image.service";

jest.mock("fs/promises");
jest.mock("sharp");
jest.mock("@aws-sdk/client-s3");

const mockConfig = {
  upload: {
    uploadDir: "uploads",
    allowedFileExtensions: ["jpg", "png", "webp"],
  },
  storage: {
    type: "local",
  },
  s3: {
    bucketName: "test-bucket",
    region: "us-east-1",
    accessKeyId: "test-key",
    secretAccessKey: "test-secret",
  },
};

describe("Image Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("ensureUploadDirExists", () => {
    it("should not create directory if it exists", async () => {
      (fs.access as jest.Mock).mockResolvedValue(undefined);
      await ensureUploadDirExists();
      expect(fs.access).toHaveBeenCalledWith(expect.any(String));
      expect(fs.mkdir).not.toHaveBeenCalled();
    });

    it("should create directory if it does not exist", async () => {
      (fs.access as jest.Mock).mockRejectedValue(new Error("Not found"));
      (fs.mkdir as jest.Mock).mockResolvedValue(undefined);
      await ensureUploadDirExists();
      expect(fs.access).toHaveBeenCalledWith(expect.any(String));
      expect(fs.mkdir).toHaveBeenCalledWith(expect.any(String), { recursive: true });
    });
  });

  describe("compressImage", () => {
    it("should compress image and return buffer with extension", async () => {
      const mockFile: Express.Multer.File = {
        fieldname: "file",
        originalname: "test.jpg",
        encoding: "7bit",
        mimetype: "image/jpeg",
        size: 1024,
        buffer: Buffer.from("original"),
        destination: "",
        filename: "test.jpg",
        path: "uploads/test.jpg",
        stream: null as any,
      };
      const mockCompressedBuffer = Buffer.from("compressed");

      (sharp as unknown as jest.Mock).mockReturnValue({
        resize: jest.fn().mockReturnThis(),
        toBuffer: jest.fn().mockResolvedValue(mockCompressedBuffer),
      });

      const result = await compressImage(mockFile);
      expect(sharp).toHaveBeenCalledWith(mockFile.buffer);
      expect(result).toEqual({ buffer: mockCompressedBuffer, extension: "jpg" });
    });
  });

 


});