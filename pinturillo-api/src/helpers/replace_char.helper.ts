export const replaceChar = (
  origString: string,
  replaceChar: string,
  index: number
) => {
  const firstPart = origString.slice(0, index);
  const lastPart = origString.slice(index + 1);
  const newString = firstPart + replaceChar + lastPart;

  return newString;
};
