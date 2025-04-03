import express from "express";
import request from "supertest";
import { healthRouter } from "../../src/routes/health.routes";

const app = express();
app.use(express.json());
app.use("/health", healthRouter);

describe("GET /health", () => {
  it("should return 200 and a valid health status JSON", async () => {
    const res = await request(app).get("/health");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("status", "UP");
    expect(res.body).toHaveProperty("uptime");
    expect(res.body).toHaveProperty("timestamp");
  });
});
