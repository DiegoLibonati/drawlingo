import { createClient } from "redis";

import { RedisClient } from "@src/entities/configs";

import { envs } from "@src/configs/env.config";

import { MESSAGES_ERROR } from "@src/constants/messages.constant";

const REDIS_HOST = envs.REDIS_HOST;
const REDIS_PORT = envs.REDIS_PORT;

let redisClient: RedisClient;

export const initRedis = async (): Promise<RedisClient> => {
  if (!redisClient) {
    redisClient = createClient({
      url: `redis://${REDIS_HOST}:${REDIS_PORT}`,
    });

    redisClient.on("connect", () => {
      console.log("Redis client connected");
    });

    redisClient.on("ready", () => {
      console.log("Redis client ready");
    });

    redisClient.on("error", (err: Error) => {
      console.error("Redis client error:", err);
    });

    redisClient.on("end", () => {
      console.log("Redis client disconnected");
    });

    await redisClient.connect();
  }

  return redisClient;
};

export const getRedisClient = (): RedisClient => {
  if (!redisClient) throw new Error(MESSAGES_ERROR.redis);
  return redisClient;
};
