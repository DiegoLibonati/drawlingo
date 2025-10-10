import { getRedisClient } from "@src/configs/redis.config";

export const RedisDAO = {
  set: <T>(key: string, value: T) =>
    getRedisClient().set(key, JSON.stringify(value)),
  get: async <T>(key: string) => {
    const value = await getRedisClient().get(key);
    const valueParsed = JSON.parse(value!) as T;
    return valueParsed;
  },
  del: async (key: string) => {
    await getRedisClient().del(key);
  },
};
