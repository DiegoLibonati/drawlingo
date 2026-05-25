describe("logger.config", () => {
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach((): void => {
    originalEnv = process.env;
    process.env = { ...originalEnv };
    jest.resetModules();
  });

  afterEach((): void => {
    process.env = originalEnv;
  });

  it("should export a logger with the configured log level", () => {
    process.env.NODE_ENV = "test";
    process.env.LOG_LEVEL = "warn";
    process.env.CLIENT_URL = "http://localhost:5173";
    process.env.REDIS_HOST = "localhost";
    process.env.REDIS_PORT = "6379";

    const { logger } = jest.requireActual<{ logger: { level: string } }>("@/configs/logger.config");

    expect(logger.level).toBe("warn");
  });

  it("should default log level to info", () => {
    process.env.NODE_ENV = "test";
    process.env.CLIENT_URL = "http://localhost:5173";
    process.env.REDIS_HOST = "localhost";
    process.env.REDIS_PORT = "6379";
    delete process.env.LOG_LEVEL;

    const { logger } = jest.requireActual<{ logger: { level: string } }>("@/configs/logger.config");

    expect(logger.level).toBe("info");
  });

  it("should expose standard logging methods", () => {
    process.env.NODE_ENV = "test";
    process.env.CLIENT_URL = "http://localhost:5173";
    process.env.REDIS_HOST = "localhost";
    process.env.REDIS_PORT = "6379";

    const { logger } = jest.requireActual<{ logger: Record<string, unknown> }>(
      "@/configs/logger.config"
    );

    expect(typeof logger.info).toBe("function");
    expect(typeof logger.error).toBe("function");
    expect(typeof logger.warn).toBe("function");
    expect(typeof logger.debug).toBe("function");
  });
});
