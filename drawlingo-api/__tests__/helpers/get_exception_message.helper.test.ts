import type { ExceptionInfo } from "@/types/helpers";

import { getExceptionMessage } from "@/helpers/get_exception_message.helper";

import { AppError } from "@/errors/app.error";
import { BadRequestError } from "@/errors/bad_request.error";
import { NotFoundError } from "@/errors/not_found.error";

import { CODES_ERROR } from "@/constants/codes.constant";
import { MESSAGES_ERROR } from "@/constants/messages.constant";

describe("get_exception_message.helper", () => {
  describe("getExceptionMessage", () => {
    it("should return status, code and message from AppError", () => {
      const error: AppError = new AppError(400, "CUSTOM_CODE", "Custom message");

      const result: ExceptionInfo = getExceptionMessage(error);

      expect(result).toEqual({ status: 400, code: "CUSTOM_CODE", message: "Custom message" });
    });

    it("should return correct info for BadRequestError", () => {
      const error: BadRequestError = new BadRequestError("BAD", "Bad request");

      const result: ExceptionInfo = getExceptionMessage(error);

      expect(result).toEqual({ status: 400, code: "BAD", message: "Bad request" });
    });

    it("should return correct info for NotFoundError", () => {
      const error: NotFoundError = new NotFoundError();

      const result: ExceptionInfo = getExceptionMessage(error);

      expect(result.status).toBe(404);
    });

    it("should return 500 with generic message for unknown errors", () => {
      const error: Error = new Error("boom");

      const result: ExceptionInfo = getExceptionMessage(error);

      expect(result).toEqual({
        status: 500,
        code: CODES_ERROR.generic,
        message: MESSAGES_ERROR.generic,
      });
    });

    it("should return 500 with generic message for non-Error values", () => {
      const result: ExceptionInfo = getExceptionMessage("oops");

      expect(result).toEqual({
        status: 500,
        code: CODES_ERROR.generic,
        message: MESSAGES_ERROR.generic,
      });
    });

    it("should return 500 with generic message for null", () => {
      const result: ExceptionInfo = getExceptionMessage(null);

      expect(result).toEqual({
        status: 500,
        code: CODES_ERROR.generic,
        message: MESSAGES_ERROR.generic,
      });
    });
  });
});
