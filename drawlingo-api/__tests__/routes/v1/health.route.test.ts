import request from "supertest";

import type { Response } from "supertest";

import app from "@/app";

import { CODES_SUCCESS } from "@/constants/codes.constant";
import { MESSAGES_SUCCESS } from "@/constants/messages.constant";

describe("health.route", () => {
  describe("GET /api/v1/health/live", () => {
    it("should return 200 with live status", async () => {
      const response: Response = await request(app).get("/api/v1/health/live");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        code: CODES_SUCCESS.healthLive,
        message: MESSAGES_SUCCESS.healthLive,
        data: null,
      });
    });
  });

  describe("GET /api/v1/health/ready", () => {
    it("should return 200 with ready status", async () => {
      const response: Response = await request(app).get("/api/v1/health/ready");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        code: CODES_SUCCESS.healthReady,
        message: MESSAGES_SUCCESS.healthReady,
        data: null,
      });
    });
  });

  describe("GET /api/v1/nonexistent", () => {
    it("should return 404 for unknown routes", async () => {
      const response: Response = await request(app).get("/api/v1/nonexistent");

      expect(response.status).toBe(404);
    });
  });
});
