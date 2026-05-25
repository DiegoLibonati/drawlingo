import { getRandomIndex } from "@/helpers/get_random_index.helper";
import { replaceChar } from "@/helpers/replace_char.helper";

export const revealLetter = (word: string, wordPlaceholder: string): string => {
  const current = wordPlaceholder.replace(/\s/g, "");

  if (word === current) return word.split("").join(" ");

  const tried = new Set<number>();

  for (;;) {
    const index = getRandomIndex(word);

    if (current[index] === word[index] || tried.has(index)) {
      tried.add(index);
      continue;
    }

    return replaceChar(current, word[index]!, index).split("").join(" ");
  }
};
