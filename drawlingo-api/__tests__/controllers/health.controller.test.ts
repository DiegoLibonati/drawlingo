import type { Request, Response, NextFunction } from "express";

import { HealthController } from "@/controllers/health.controller";

import { CODES_SUCCESS } from "@/constants/codes.constant";
import { MESSAGES_SUCCESS } from "@/constants/messages.constant";

const buildMockRes = (): Response => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
};

describe("health.controller", () => {
  describe("live", () => {
    it("should return 200 with live status", () => {
      const mockReq: Request = {} as Request;
      const mockRes: Response = buildMockRes();
      const mockNext: NextFunction = jest.fn();

      HealthController.live(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        code: CODES_SUCCESS.healthLive,
        message: MESSAGES_SUCCESS.healthLive,
        data: null,
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should call next when an error occurs", () => {
      const mockReq: Request = {} as Request;
      const mockRes: Response = buildMockRes();
      const mockNext: NextFunction = jest.fn();
      (mockRes.status as jest.Mock).mockImplementation(() => {
        throw new Error("boom");
      });

      HealthController.live(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe("ready", () => {
    it("should return 200 with ready status", () => {
      const mockReq: Request = {} as Request;
      const mockRes: Response = buildMockRes();
      const mockNext: NextFunction = jest.fn();

      HealthController.ready(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        code: CODES_SUCCESS.healthReady,
        message: MESSAGES_SUCCESS.healthReady,
        data: null,
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should call next when an error occurs", () => {
      const mockReq: Request = {} as Request;
      const mockRes: Response = buildMockRes();
      const mockNext: NextFunction = jest.fn();
      (mockRes.status as jest.Mock).mockImplementation(() => {
        throw new Error("boom");
      });

      HealthController.ready(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });
});
