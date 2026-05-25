import { getRandomIndex } from "@/helpers/get_random_index.helper";

export const getFourRandomWords = (words: string[]): string[] => {
  const pool = [...words];
  const result: string[] = [];

  while (result.length < 4) {
    const index = getRandomIndex(pool);
    result.push(pool.splice(index, 1)[0]!);
  }

  return result;
};
