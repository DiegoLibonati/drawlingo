export const getRandomIndex = (item: { length: number }): number => {
  return Math.floor(Math.random() * item.length);
};
