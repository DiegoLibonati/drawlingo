import type { Envs } from "@/types/env";

describe("env.config", () => {
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach((): void => {
    originalEnv = process.env;
    process.env = { ...originalEnv };
    jest.resetModules();
  });

  afterEach((): void => {
    process.env = originalEnv;
  });

  it("should export envs with correct values when all vars are set", () => {
    process.env.NODE_ENV = "test";
    process.env.PORT = "3000";
    process.env.CLIENT_URL = "http://localhost:5173";
    process.env.REDIS_HOST = "localhost";
    process.env.REDIS_PORT = "6379";

    const { envs } = jest.requireActual<{ envs: Envs }>("@/configs/env.config");

    expect(envs.ENV).toBe("test");
    expect(envs.PORT).toBe(3000);
    expect(envs.CLIENT_URL).toBe("http://localhost:5173");
    expect(envs.REDIS_HOST).toBe("localhost");
    expect(envs.REDIS_PORT).toBe("6379");
  });

  it("should use default PORT when not defined", () => {
    delete process.env.PORT;
    process.env.CLIENT_URL = "http://localhost:5173";
    process.env.REDIS_HOST = "localhost";
    process.env.REDIS_PORT = "6379";

    const { envs } = jest.requireActual<{ envs: Envs }>("@/configs/env.config");

    expect(envs.PORT).toBe(5050);
  });

  it("should use default NODE_ENV when not defined", () => {
    delete process.env.NODE_ENV;
    process.env.CLIENT_URL = "http://localhost:5173";
    process.env.REDIS_HOST = "localhost";
    process.env.REDIS_PORT = "6379";

    const { envs } = jest.requireActual<{ envs: Envs }>("@/configs/env.config");

    expect(envs.ENV).toBe("development");
  });

  it("should throw when CLIENT_URL is missing", () => {
    delete process.env.CLIENT_URL;
    process.env.REDIS_HOST = "localhost";
    process.env.REDIS_PORT = "6379";

    expect(() => {
      jest.requireActual("@/configs/env.config");
    }).toThrow("Invalid environment variables");
  });

  it("should throw when REDIS_HOST is missing", () => {
    process.env.CLIENT_URL = "http://localhost:5173";
    delete process.env.REDIS_HOST;
    process.env.REDIS_PORT = "6379";

    expect(() => {
      jest.requireActual("@/configs/env.config");
    }).toThrow("Invalid environment variables");
  });

  it("should throw when REDIS_PORT is missing", () => {
    process.env.CLIENT_URL = "http://localhost:5173";
    process.env.REDIS_HOST = "localhost";
    delete process.env.REDIS_PORT;

    expect(() => {
      jest.requireActual("@/configs/env.config");
    }).toThrow("Invalid environment variables");
  });

  it("should coerce PORT to number", () => {
    process.env.PORT = "8080";
    process.env.CLIENT_URL = "http://localhost:5173";
    process.env.REDIS_HOST = "localhost";
    process.env.REDIS_PORT = "6379";

    const { envs } = jest.requireActual<{ envs: Envs }>("@/configs/env.config");

    expect(typeof envs.PORT).toBe("number");
    expect(envs.PORT).toBe(8080);
  });
});
