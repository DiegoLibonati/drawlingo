export const generateWordPlaceholder = (word: string): string => {
  return word.replace(/\p{L}/gu, "_");
};
