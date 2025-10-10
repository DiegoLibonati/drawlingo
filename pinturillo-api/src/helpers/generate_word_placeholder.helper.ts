export const generateWordPlaceholder = (word: string): string => {
  return word.replace(/[A-Za-z]/g, "_");
};
