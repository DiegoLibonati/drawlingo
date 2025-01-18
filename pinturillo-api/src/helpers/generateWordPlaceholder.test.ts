import { generateWordPlaceholder } from "@src/helpers/generateWordPlaceholder";

describe("generateWordPlaceholder.ts", () => {
  describe("General Tests.", () => {
    test("It should replace all alphabetic characters with underscores.", () => {
      const result = generateWordPlaceholder("hello");
      expect(result).toBe("_____");
    });

    test("It should return an empty string if the word is empty.", () => {
      const result = generateWordPlaceholder("");
      expect(result).toBe("");
    });

    test("It should handle a word with mixed case.", () => {
      const result = generateWordPlaceholder("HeLlO");
      expect(result).toBe("_____");
    });
  });
});
