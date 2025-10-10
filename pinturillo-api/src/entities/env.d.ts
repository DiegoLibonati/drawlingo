export type Envs = {
  PORT: Port;
  ENV: Env;
  BASE_URL: BaseUrl;
  CLIENT_URL: ClientUrl;
  REDIS_HOST: RedisHost;
  REDIS_PORT: RedisPort;
};

type Port = number;
type Env = "development" | "production" | "testing";
type BaseUrl = string;
type ClientUrl = string;
type RedisHost = string;
type RedisPort = number;
