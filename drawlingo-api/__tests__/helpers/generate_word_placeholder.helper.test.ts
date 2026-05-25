import { generateWordPlaceholder } from "@/helpers/generate_word_placeholder.helper";

describe("generate_word_placeholder.helper", () => {
  describe("generateWordPlaceholder", () => {
    it("should replace all letters with underscores", () => {
      const result: string = generateWordPlaceholder("ARBOL");

      expect(result).toBe("_____");
    });

    it("should preserve non-letter characters", () => {
      const result: string = generateWordPlaceholder("A-B");

      expect(result).toBe("_-_");
    });

    it("should handle empty string", () => {
      const result: string = generateWordPlaceholder("");

      expect(result).toBe("");
    });

    it("should handle unicode letters", () => {
      const result: string = generateWordPlaceholder("SUEÑO");

      expect(result).toBe("_____");
    });

    it("should preserve spaces", () => {
      const result: string = generateWordPlaceholder("A B");

      expect(result).toBe("_ _");
    });

    it("should preserve digits", () => {
      const result: string = generateWordPlaceholder("A1B");

      expect(result).toBe("_1_");
    });
  });
});
