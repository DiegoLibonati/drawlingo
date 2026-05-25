import { getRandomIndex } from "@/helpers/get_random_index.helper";

describe("get_random_index.helper", () => {
  describe("getRandomIndex", () => {
    it("should return 0 when Math.random returns 0", () => {
      jest.spyOn(Math, "random").mockReturnValue(0);

      const result: number = getRandomIndex({ length: 5 });

      expect(result).toBe(0);
    });

    it("should return last index when Math.random returns value close to 1", () => {
      jest.spyOn(Math, "random").mockReturnValue(0.99);

      const result: number = getRandomIndex({ length: 5 });

      expect(result).toBe(4);
    });

    it("should return a valid index within range", () => {
      jest.spyOn(Math, "random").mockReturnValue(0.5);

      const result: number = getRandomIndex({ length: 10 });

      expect(result).toBe(5);
    });

    it("should return 0 for item with length 1", () => {
      jest.spyOn(Math, "random").mockReturnValue(0.99);

      const result: number = getRandomIndex({ length: 1 });

      expect(result).toBe(0);
    });
  });
});
