import type { Request, Response, NextFunction } from "express";

import { rateLimiter } from "@/middlewares/rate_limit.middleware";

describe("rate_limit.middleware", () => {
  describe("rateLimiter", () => {
    it("should be a function", () => {
      expect(typeof rateLimiter).toBe("function");
    });

    it("should call next when rate limit max is 0 (passthrough)", () => {
      const mockReq: Request = {} as Request;
      const mockRes: Response = {} as Response;
      const mockNext: NextFunction = jest.fn();

      rateLimiter(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });
  });
});
