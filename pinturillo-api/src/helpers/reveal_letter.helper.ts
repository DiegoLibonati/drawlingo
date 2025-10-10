import { getRandomIndex } from "@src/helpers/get_random_index.helper";
import { replaceChar } from "@src/helpers/replace_char.helper";

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
