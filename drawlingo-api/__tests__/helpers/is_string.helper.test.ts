import { isString } from "@/helpers/is_string.helper";

describe("is_string.helper", () => {
  describe("isString", () => {
    it("should return true for a string", () => {
      expect(isString("hello")).toBe(true);
    });

    it("should return true for an empty string", () => {
      expect(isString("")).toBe(true);
    });

    it("should return false for a number", () => {
      expect(isString(123)).toBe(false);
    });

    it("should return false for null", () => {
      expect(isString(null)).toBe(false);
    });

    it("should return false for undefined", () => {
      expect(isString(undefined)).toBe(false);
    });

    it("should return false for a boolean", () => {
      expect(isString(true)).toBe(false);
    });

    it("should return false for an object", () => {
      expect(isString({})).toBe(false);
    });

    it("should return false for an array", () => {
      expect(isString([])).toBe(false);
    });
  });
});
