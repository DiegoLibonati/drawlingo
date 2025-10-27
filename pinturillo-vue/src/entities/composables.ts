export type UseSessionStorage = {
  handleSetItem: <T>(key: string, value: T) => void;
  handleGetItem: <T>(key: string) => T;
  handleRemoveItem: (key: string) => void;
};
