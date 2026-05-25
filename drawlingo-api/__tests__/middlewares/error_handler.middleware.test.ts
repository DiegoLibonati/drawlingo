import type { Request, Response, NextFunction } from "express";

import { errorHandler } from "@/middlewares/error_handler.middleware";

import { AppError } from "@/errors/app.error";
import { BadRequestError } from "@/errors/bad_request.error";
import { NotFoundError } from "@/errors/not_found.error";

import { CODES_ERROR } from "@/constants/codes.constant";
import { MESSAGES_ERROR } from "@/constants/messages.constant";

jest.mock("@/configs/logger.config", () => ({
  logger: { error: jest.fn(), info: jest.fn(), warn: jest.fn() },
}));

const buildMockRes = (): Response => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
};

describe("error_handler.middleware", () => {
  describe("errorHandler", () => {
    it("should respond 400 for BadRequestError", () => {
      const error: BadRequestError = new BadRequestError("BAD", "Bad request");
      const mockReq: Request = {} as Request;
      const mockRes: Response = buildMockRes();
      const mockNext: NextFunction = jest.fn();

      errorHandler(error, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ code: "BAD", message: "Bad request" });
    });

    it("should respond 404 for NotFoundError", () => {
      const error: NotFoundError = new NotFoundError();
      const mockReq: Request = {} as Request;
      const mockRes: Response = buildMockRes();
      const mockNext: NextFunction = jest.fn();

      errorHandler(error, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(404);
    });

    it("should respond 500 for generic Error", () => {
      const error: Error = new Error("boom");
      const mockReq: Request = {} as Request;
      const mockRes: Response = buildMockRes();
      const mockNext: NextFunction = jest.fn();

      errorHandler(error, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        code: CODES_ERROR.generic,
        message: MESSAGES_ERROR.generic,
      });
    });

    it("should respond with the AppError status and code", () => {
      const error: AppError = new AppError(422, "CUSTOM", "Custom error");
      const mockReq: Request = {} as Request;
      const mockRes: Response = buildMockRes();
      const mockNext: NextFunction = jest.fn();

      errorHandler(error, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(422);
      expect(mockRes.json).toHaveBeenCalledWith({ code: "CUSTOM", message: "Custom error" });
    });

    it("should log error for 500 status", () => {
      const { logger } = jest.requireMock("@/configs/logger.config");
      logger.error.mockClear();
      const error: Error = new Error("server crash");
      const mockReq: Request = {} as Request;
      const mockRes: Response = buildMockRes();
      const mockNext: NextFunction = jest.fn();

      errorHandler(error, mockReq, mockRes, mockNext);

      expect(logger.error).toHaveBeenCalled();
    });

    it("should not log error for client errors", () => {
      const { logger } = jest.requireMock("@/configs/logger.config");
      logger.error.mockClear();
      const error: BadRequestError = new BadRequestError("BAD", "Bad");
      const mockReq: Request = {} as Request;
      const mockRes: Response = buildMockRes();
      const mockNext: NextFunction = jest.fn();

      errorHandler(error, mockReq, mockRes, mockNext);

      expect(logger.error).not.toHaveBeenCalled();
    });
  });
});
