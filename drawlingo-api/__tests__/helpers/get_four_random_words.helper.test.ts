import { getFourRandomWords } from "@/helpers/get_four_random_words.helper";

describe("get_four_random_words.helper", () => {
  describe("getFourRandomWords", () => {
    it("should return exactly 4 words", () => {
      const words: string[] = ["A", "B", "C", "D", "E", "F"];

      const result: string[] = getFourRandomWords(words);

      expect(result).toHaveLength(4);
    });

    it("should return words from the input array", () => {
      const words: string[] = ["A", "B", "C", "D", "E"];

      const result: string[] = getFourRandomWords(words);

      result.forEach((word: string) => {
        expect(words).toContain(word);
      });
    });

    it("should return unique words", () => {
      const words: string[] = ["A", "B", "C", "D", "E"];

      const result: string[] = getFourRandomWords(words);

      const unique = new Set(result);
      expect(unique.size).toBe(4);
    });

    it("should not mutate the original array", () => {
      const words: string[] = ["A", "B", "C", "D", "E"];
      const original: string[] = [...words];

      getFourRandomWords(words);

      expect(words).toEqual(original);
    });

    it("should return all words when input has exactly 4", () => {
      const words: string[] = ["A", "B", "C", "D"];

      const result: string[] = getFourRandomWords(words);

      expect(result).toHaveLength(4);
      expect(result.sort()).toEqual(words.sort());
    });
  });
});
