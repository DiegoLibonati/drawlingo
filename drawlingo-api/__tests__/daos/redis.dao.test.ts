import redisClient from "@/configs/redis.config";

import { RedisDAO } from "@/daos/redis.dao";

describe("redis.dao", () => {
  beforeAll(async (): Promise<void> => {
    await redisClient.connect();
  });

  afterAll(async (): Promise<void> => {
    await redisClient.quit();
  });

  beforeEach(async (): Promise<void> => {
    await redisClient.flushAll();
  });

  describe("getValue", () => {
    it("should return null when key does not exist", async () => {
      const result: string | null = await RedisDAO.getValue("nonexistent");

      expect(result).toBeNull();
    });

    it("should return the value when key exists", async () => {
      await redisClient.set("testkey", "testvalue");

      const result: string | null = await RedisDAO.getValue("testkey");

      expect(result).toBe("testvalue");
    });
  });

  describe("setValue", () => {
    it("should set a value and return OK", async () => {
      const result: string | null = await RedisDAO.setValue("key1", "value1");

      expect(result).toBe("OK");
      const stored: string | null = await redisClient.get("key1");
      expect(stored).toBe("value1");
    });

    it("should overwrite an existing value", async () => {
      await redisClient.set("key1", "old");

      await RedisDAO.setValue("key1", "new");

      const stored: string | null = await redisClient.get("key1");
      expect(stored).toBe("new");
    });
  });

  describe("deleteKey", () => {
    it("should delete an existing key and return 1", async () => {
      await redisClient.set("key1", "value1");

      const result: number = await RedisDAO.deleteKey("key1");

      expect(result).toBe(1);
      const stored: string | null = await redisClient.get("key1");
      expect(stored).toBeNull();
    });

    it("should return 0 when key does not exist", async () => {
      const result: number = await RedisDAO.deleteKey("nonexistent");

      expect(result).toBe(0);
    });
  });
});
