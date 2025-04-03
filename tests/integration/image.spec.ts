import express from "express";
import request from "supertest";

import { imageRouter } from "../../src/routes/image.routes";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", imageRouter);

describe("Image Endpoints", () => {
  describe("POST /upload/image", () => {
    it("should return 400 if no file is provided", async () => {
      const res = await request(app).post("/upload/image");
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: "No image provided" });
    });

    it("should upload a valid image (<5MB) and allow retrieval", async () => {
      const base64Image =
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/P8P2SgAAAABJRU5ErkJggg==";
      const imageBuffer = Buffer.from(base64Image, "base64");

      const uploadRes = await request(app)
        .post("/upload/image")
        .attach("image", imageBuffer, "test.png");

      expect(uploadRes.status).toBe(200);
      expect(uploadRes.body).toHaveProperty("filename");
      expect(uploadRes.body).toHaveProperty("url");
      expect(uploadRes.body.url).toMatch(/^\/static\/image\/.+$/);

      const filename = uploadRes.body.filename;
      const getRes = await request(app).get(`/static/image/${filename}`);

      expect(getRes.status).toBe(200);
      expect(getRes.headers["content-type"]).toMatch(/image\/(png|jpeg|webp)/);
      expect(getRes.body).toBeDefined();
      expect(getRes.body.length).toBeGreaterThan(0);
    });

    it("should return 413 if image exceeds size limit (5MB)", async () => {
      const largeBuffer = Buffer.alloc(6 * 1024 * 1024, "a");

      const res = await request(app)
        .post("/upload/image")
        .attach("image", largeBuffer, "big.jpg");

      expect(res.status).toBe(413);
      expect(res.body).toHaveProperty("error");
      expect(res.body.error).toMatch(/File size exceeds/);
    });
  });

  describe("GET /static/image/:filename", () => {
    it("should return 404 for non-existent image", async () => {
      const res = await request(app).get("/static/image/nonexistent.jpg");
      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: "Image not found" });
    });
  });
});
