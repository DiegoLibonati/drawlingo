import type { Request, Response } from "express";

import { notFoundHandler } from "@/middlewares/not_found_handler.middleware";

import { CODES_NOT } from "@/constants/codes.constant";
import { MESSAGES_NOT } from "@/constants/messages.constant";

const buildMockRes = (): Response => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
};

describe("not_found_handler.middleware", () => {
  describe("notFoundHandler", () => {
    it("should respond 404 with not found code and message", () => {
      const mockReq: Request = {} as Request;
      const mockRes: Response = buildMockRes();

      notFoundHandler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        code: CODES_NOT.foundRoute,
        message: MESSAGES_NOT.foundRoute,
      });
    });
  });
});
