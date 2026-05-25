import { AppError } from "@/errors/app.error";

describe("app.error", () => {
  describe("AppError", () => {
    it("should be an instance of Error", () => {
      const error: AppError = new AppError(500, "CODE", "message");

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(AppError);
    });

    it("should expose status, code and message", () => {
      const error: AppError = new AppError(400, "BAD_REQUEST", "Invalid input");

      expect(error.status).toBe(400);
      expect(error.code).toBe("BAD_REQUEST");
      expect(error.message).toBe("Invalid input");
    });

    it("should have the correct name", () => {
      const error: AppError = new AppError(500, "CODE", "message");

      expect(error.name).toBe("AppError");
    });
  });
});
