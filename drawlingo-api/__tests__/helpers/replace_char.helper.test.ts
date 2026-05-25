import { replaceChar } from "@/helpers/replace_char.helper";

describe("replace_char.helper", () => {
  describe("replaceChar", () => {
    it("should replace character at the specified index", () => {
      const result: string = replaceChar("hello", "a", 1);

      expect(result).toBe("hallo");
    });

    it("should replace the first character", () => {
      const result: string = replaceChar("hello", "H", 0);

      expect(result).toBe("Hello");
    });

    it("should replace the last character", () => {
      const result: string = replaceChar("hello", "!", 4);

      expect(result).toBe("hell!");
    });

    it("should handle single character string", () => {
      const result: string = replaceChar("a", "b", 0);

      expect(result).toBe("b");
    });
  });
});
