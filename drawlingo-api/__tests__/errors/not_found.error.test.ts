import { AppError } from "@/errors/app.error";
import { NotFoundError } from "@/errors/not_found.error";

import { CODES_NOT } from "@/constants/codes.constant";
import { MESSAGES_NOT } from "@/constants/messages.constant";

describe("not_found.error", () => {
  describe("NotFoundError", () => {
    it("should be an instance of AppError and Error", () => {
      const error: NotFoundError = new NotFoundError();

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(AppError);
      expect(error).toBeInstanceOf(NotFoundError);
    });

    it("should have status 404", () => {
      const error: NotFoundError = new NotFoundError();

      expect(error.status).toBe(404);
    });

    it("should use default code and message when none provided", () => {
      const error: NotFoundError = new NotFoundError();

      expect(error.code).toBe(CODES_NOT.foundRoute);
      expect(error.message).toBe(MESSAGES_NOT.foundRoute);
    });

    it("should accept custom code and message", () => {
      const error: NotFoundError = new NotFoundError("CUSTOM", "Not here");

      expect(error.code).toBe("CUSTOM");
      expect(error.message).toBe("Not here");
    });

    it("should have the correct name", () => {
      const error: NotFoundError = new NotFoundError();

      expect(error.name).toBe("NotFoundError");
    });
  });
});
