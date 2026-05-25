export const replaceChar = (str: string, char: string, index: number): string => {
  return str.slice(0, index) + char + str.slice(index + 1);
};
