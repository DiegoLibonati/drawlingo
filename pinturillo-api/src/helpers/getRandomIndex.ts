export const getRandomIndex = <T>(item: string | T[]): number => {
  const randomIndex = Math.floor(Math.random() * item.length);
  return randomIndex;
};
