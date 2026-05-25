import redisClient from "@/configs/redis.config";
import { envs } from "@/configs/env.config";
import { logger } from "@/configs/logger.config";

import { initSockets } from "@/sockets";

import { RedisService } from "@/services/redis.service";

import { INITIAL_LOBBY, INITIAL_ROOMS, INITIAL_USERS } from "@/constants/vars.constant";

import app from "@/app";

const { PORT, ENV, BASE_URL } = envs;

const SHUTDOWN_TIMEOUT_MS = 10_000;

let server: ReturnType<typeof app.listen>;
let io: ReturnType<typeof initSockets>;

const onInit = (): void => {
  const baseUrl = ENV === "development" ? `http://localhost:${PORT}` : BASE_URL;
  logger.info({ env: ENV, baseUrl }, `Server running in ${ENV} mode on ${baseUrl}`);
};

const shutdown = async (): Promise<void> => {
  await io.close();
  server.close((err?: Error) => {
    process.exit(err ? 1 : 0);
  });
  setTimeout(() => {
    process.exit(1);
  }, SHUTDOWN_TIMEOUT_MS).unref();
};

const start = async (): Promise<void> => {
  await redisClient.connect();
  await RedisService.setUsers(INITIAL_USERS);
  await RedisService.setRooms(INITIAL_ROOMS);
  await RedisService.setLobby(INITIAL_LOBBY);
  server = app.listen(PORT, onInit);
  io = initSockets(server);
};

process.on("SIGTERM", () => void shutdown());
process.on("SIGINT", () => void shutdown());

void start();
