import { getFourRandomWords } from "@src/helpers/getFourRandomWords";

test("It should return exactly 4 random words from the provided list.", async () => {
  const words = ["apple", "banana", "cherry", "date"];

  const result = await getFourRandomWords(words);

  expect(result).toHaveLength(4);
});

test("It should return empty array when input is an empty array.", async () => {
  const words: string[] = [];
  const result = await getFourRandomWords(words);
  expect(result).toEqual([]);
});
