import { Config } from "@src/entities/entities";

export const config: Config = {
  API: {
    PORT: Number(process.env.PORT) || 5000,
  },
  REDIS: {
    HOST: process.env.REDIS_HOST || "host.docker.internal",
    PORT: Number(process.env.REDIS_PORT) || 6379,
  },
  CLIENT: {
    URL: process.env.CLIENT_URL || "host.docker.internal",
  },
};
