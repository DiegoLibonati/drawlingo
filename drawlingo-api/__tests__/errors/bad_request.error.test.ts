import { AppError } from "@/errors/app.error";
import { BadRequestError } from "@/errors/bad_request.error";

describe("bad_request.error", () => {
  describe("BadRequestError", () => {
    it("should be an instance of AppError and Error", () => {
      const error: BadRequestError = new BadRequestError("CODE", "message");

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(AppError);
      expect(error).toBeInstanceOf(BadRequestError);
    });

    it("should have status 400", () => {
      const error: BadRequestError = new BadRequestError("CODE", "message");

      expect(error.status).toBe(400);
    });

    it("should expose code and message", () => {
      const error: BadRequestError = new BadRequestError("VALIDATION", "Invalid field");

      expect(error.code).toBe("VALIDATION");
      expect(error.message).toBe("Invalid field");
    });

    it("should have the correct name", () => {
      const error: BadRequestError = new BadRequestError("CODE", "message");

      expect(error.name).toBe("BadRequestError");
    });
  });
});
