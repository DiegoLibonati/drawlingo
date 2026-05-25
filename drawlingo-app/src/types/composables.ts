export interface UseSessionStorage {
  handleSetItem: (key: string, value: unknown) => void;
  handleGetItem: (key: string) => unknown;
  handleRemoveItem: (key: string) => void;
}
