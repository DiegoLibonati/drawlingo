import type { Request, Response, NextFunction } from "express";

import { requestId } from "@/middlewares/request_id.middleware";

const buildMockReq = (overrides: Partial<Request> = {}): Request => {
  return {
    header: jest.fn().mockReturnValue(undefined),
    ...overrides,
  } as unknown as Request;
};

const buildMockRes = (): Response => {
  return {
    setHeader: jest.fn(),
  } as unknown as Response;
};

describe("request_id.middleware", () => {
  describe("requestId", () => {
    it("should generate a new id when no x-request-id header is present", () => {
      const mockReq: Request = buildMockReq();
      const mockRes: Response = buildMockRes();
      const mockNext: NextFunction = jest.fn();

      requestId(mockReq, mockRes, mockNext);

      expect(mockReq.id).toBeDefined();
      expect(typeof mockReq.id).toBe("string");
      expect(mockReq.id.length).toBeGreaterThan(0);
      expect(mockRes.setHeader).toHaveBeenCalledWith("x-request-id", mockReq.id);
      expect(mockNext).toHaveBeenCalled();
    });

    it("should use the incoming x-request-id header when present", () => {
      const mockReq: Request = buildMockReq({
        header: jest.fn().mockReturnValue("custom-id-123") as unknown as Request["header"],
      });
      const mockRes: Response = buildMockRes();
      const mockNext: NextFunction = jest.fn();

      requestId(mockReq, mockRes, mockNext);

      expect(mockReq.id).toBe("custom-id-123");
      expect(mockRes.setHeader).toHaveBeenCalledWith("x-request-id", "custom-id-123");
      expect(mockNext).toHaveBeenCalled();
    });

    it("should generate a new id when x-request-id header is empty string", () => {
      const mockReq: Request = buildMockReq({
        header: jest.fn().mockReturnValue("") as unknown as Request["header"],
      });
      const mockRes: Response = buildMockRes();
      const mockNext: NextFunction = jest.fn();

      requestId(mockReq, mockRes, mockNext);

      expect(mockReq.id).toBeDefined();
      expect(mockReq.id).not.toBe("");
      expect(mockNext).toHaveBeenCalled();
    });
  });
});
