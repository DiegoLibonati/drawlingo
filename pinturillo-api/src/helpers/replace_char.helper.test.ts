import { replaceChar } from "@src/helpers/replace_char.helper";

describe("replace_char.helper.ts", () => {
  describe("General Tests.", () => {
    test("It should replace the character at the specified index.", () => {
      const result = replaceChar("hello", "a", 1);
      expect(result).toBe("hallo");
    });

    test("It should replace the first character when index is 0.", () => {
      const result = replaceChar("hello", "H", 0);
      expect(result).toBe("Hello");
    });

    test("It should replace the last character when index is the last index.", () => {
      const result = replaceChar("hello", "!", 4);
      expect(result).toBe("hell!");
    });
  });
});
