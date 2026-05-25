import { AppError } from "@/errors/app.error";
import { UnauthorizedError } from "@/errors/unauthorized.error";

describe("unauthorized.error", () => {
  describe("UnauthorizedError", () => {
    it("should be an instance of AppError and Error", () => {
      const error: UnauthorizedError = new UnauthorizedError("CODE", "message");

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(AppError);
      expect(error).toBeInstanceOf(UnauthorizedError);
    });

    it("should have status 401", () => {
      const error: UnauthorizedError = new UnauthorizedError("CODE", "message");

      expect(error.status).toBe(401);
    });

    it("should expose code and message", () => {
      const error: UnauthorizedError = new UnauthorizedError("UNAUTH", "No access");

      expect(error.code).toBe("UNAUTH");
      expect(error.message).toBe("No access");
    });

    it("should have the correct name", () => {
      const error: UnauthorizedError = new UnauthorizedError("CODE", "message");

      expect(error.name).toBe("UnauthorizedError");
    });
  });
});
