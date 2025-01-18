import { getRandomIndex } from "@src/helpers/getRandomIndex";

describe("getRandomIndex.ts", () => {
  describe("General Tests.", () => {
    test("It should return a random index for a string.", () => {
      const str = "hello";
      const index = getRandomIndex(str);
      expect(index).toBeGreaterThanOrEqual(0);
      expect(index).toBeLessThan(str.length);
    });

    test("It should return a random index for an array of numbers.", () => {
      const arr = [1, 2, 3, 4, 5];
      const index = getRandomIndex(arr);
      expect(index).toBeGreaterThanOrEqual(0);
      expect(index).toBeLessThan(arr.length);
    });

    test("It should return a random index for an empty array.", () => {
      const arr: number[] = [];
      const index = getRandomIndex(arr);
      expect(index).toEqual(0);
    });
  });
});
