import { getRandomIndex } from "@src/helpers/getRandomIndex";
import { replaceChar } from "@src/helpers/replaceChar";

export const revealLetter = (
  word: string,
  wordPlaceholder: string
): Promise<string> => {
  return new Promise((resolve) => {
    const indexUsed: number[] = [];
    const wordPlaceholderWithoutSpaces = wordPlaceholder.replace(/\s/g, "");

    let letterReplaced = false;

    while (!letterReplaced) {
      const randomIndex = getRandomIndex(word);
      const letterToReplace = word[randomIndex];

      if (word === wordPlaceholderWithoutSpaces) {
        resolve(word.split("").join(" "));
        break;
      }

      if (
        wordPlaceholderWithoutSpaces[randomIndex].trim() ===
          letterToReplace.trim() ||
        indexUsed.includes(randomIndex)
      ) {
        indexUsed.push(randomIndex);
        continue;
      }

      const wordPlaceholder = replaceChar(
        wordPlaceholderWithoutSpaces,
        letterToReplace,
        randomIndex
      );

      resolve(wordPlaceholder.split("").join(" "));
      break;
    }
  });
};
