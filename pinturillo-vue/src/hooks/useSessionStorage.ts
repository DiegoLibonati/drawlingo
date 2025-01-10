type UseSessionStorage = {
  handleSetItem: <T>(key: string, value: T) => void;
  handleGetItem: <T>(key: string) => T;
  handleRemoveItem: (key: string) => void;
};

export function useSessionStorage(): UseSessionStorage {
  const handleSetItem = <T>(key: string, value: T): void => {
    sessionStorage.setItem(key, JSON.stringify(value));
    return;
  };

  const handleGetItem = <T>(key: string): T => {
    const item = sessionStorage.getItem(key);
    return JSON.parse(item!);
  };

  const handleRemoveItem = (key: string): void => {
    sessionStorage.removeItem(key);
    return;
  };

  return {
    handleSetItem: handleSetItem,
    handleGetItem: handleGetItem,
    handleRemoveItem: handleRemoveItem,
  };
}
