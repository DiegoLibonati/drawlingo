import { revealLetter } from "@/helpers/reveal_letter.helper";

describe("reveal_letter.helper", () => {
  describe("revealLetter", () => {
    it("should reveal one letter in the placeholder", () => {
      jest.spyOn(Math, "random").mockReturnValue(0);

      const result: string = revealLetter("ARBOL", "_ _ _ _ _");

      const chars: string[] = result.split(" ");
      const revealed: string[] = chars.filter((c: string) => c !== "_");
      expect(revealed.length).toBeGreaterThanOrEqual(1);
    });

    it("should return the full word spaced when placeholder matches word", () => {
      const result: string = revealLetter("AB", "A B");

      expect(result).toBe("A B");
    });

    it("should skip already revealed positions", () => {
      jest.spyOn(Math, "random").mockReturnValueOnce(0).mockReturnValue(0.99);

      const result: string = revealLetter("AB", "A _");

      expect(result).toBe("A B");
    });

    it("should return spaced characters", () => {
      jest.spyOn(Math, "random").mockReturnValue(0);

      const result: string = revealLetter("AB", "_ _");

      expect(result).toContain(" ");
    });
  });
});
