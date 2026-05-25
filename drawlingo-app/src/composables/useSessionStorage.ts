import type { UseSessionStorage } from "@/types/composables";

export function useSessionStorage(): UseSessionStorage {
  const handleSetItem = (key: string, value: unknown): void => {
    sessionStorage.setItem(key, JSON.stringify(value));
  };

  const handleGetItem = (key: string): unknown => {
    const item = sessionStorage.getItem(key);
    if (item === null) return null;
    return JSON.parse(item) as unknown;
  };

  const handleRemoveItem = (key: string): void => {
    sessionStorage.removeItem(key);
  };

  return {
    handleSetItem: handleSetItem,
    handleGetItem: handleGetItem,
    handleRemoveItem: handleRemoveItem,
  };
}
