import { AppError } from "@/errors/app.error";
import { ConflictError } from "@/errors/conflict.error";

describe("conflict.error", () => {
  describe("ConflictError", () => {
    it("should be an instance of AppError and Error", () => {
      const error: ConflictError = new ConflictError("CODE", "message");

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(AppError);
      expect(error).toBeInstanceOf(ConflictError);
    });

    it("should have status 409", () => {
      const error: ConflictError = new ConflictError("CODE", "message");

      expect(error.status).toBe(409);
    });

    it("should expose code and message", () => {
      const error: ConflictError = new ConflictError("DUPLICATE", "Already exists");

      expect(error.code).toBe("DUPLICATE");
      expect(error.message).toBe("Already exists");
    });

    it("should have the correct name", () => {
      const error: ConflictError = new ConflictError("CODE", "message");

      expect(error.name).toBe("ConflictError");
    });
  });
});
