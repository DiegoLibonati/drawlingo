import { getRandomIndex } from "@src/helpers/get_random_index.helper";

export const getFourRandomWords = (words: string[]): Promise<string[]> => {
  const wordsToGet = [...words];

  return new Promise((resolve) => {
    const wordsToChoose: string[] = [];

    while (wordsToChoose.length < 4) {
      const randomIndex = getRandomIndex<string>(wordsToGet);
      const word = wordsToGet[randomIndex];
      wordsToGet.splice(randomIndex, 1);

      wordsToChoose.push(word);
    }

    resolve(wordsToChoose);
  });
};
