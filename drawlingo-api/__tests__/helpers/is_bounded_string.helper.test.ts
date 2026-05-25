import { isBoundedString } from "@/helpers/is_bounded_string.helper";

describe("is_bounded_string.helper", () => {
  describe("isBoundedString", () => {
    it("should return true for a string within bounds", () => {
      expect(isBoundedString("hello", 1, 10)).toBe(true);
    });

    it("should return true when trimmed length equals min", () => {
      expect(isBoundedString("a", 1, 10)).toBe(true);
    });

    it("should return true when length equals max", () => {
      expect(isBoundedString("hello", 1, 5)).toBe(true);
    });

    it("should return false when trimmed length is below min", () => {
      expect(isBoundedString("  ", 1, 10)).toBe(false);
    });

    it("should return false when length exceeds max", () => {
      expect(isBoundedString("toolong", 1, 3)).toBe(false);
    });

    it("should return false for non-string values", () => {
      expect(isBoundedString(123, 1, 10)).toBe(false);
      expect(isBoundedString(null, 1, 10)).toBe(false);
      expect(isBoundedString(undefined as unknown, 1, 10)).toBe(false);
    });

    it("should return false for empty string when min is 1", () => {
      expect(isBoundedString("", 1, 10)).toBe(false);
    });

    it("should return true for empty string when min is 0", () => {
      expect(isBoundedString("", 0, 10)).toBe(true);
    });
  });
});
