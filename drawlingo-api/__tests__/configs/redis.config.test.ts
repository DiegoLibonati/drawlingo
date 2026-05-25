jest.mock("redis", () => ({
  createClient: jest.fn(() => ({ on: jest.fn() })),
}));

describe("redis.config", () => {
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach((): void => {
    originalEnv = process.env;
    process.env = { ...originalEnv };
    jest.resetModules();
  });

  afterEach((): void => {
    process.env = originalEnv;
  });

  it("should create a redis client with the correct URL", () => {
    process.env.NODE_ENV = "test";
    process.env.CLIENT_URL = "http://localhost:5173";
    process.env.REDIS_HOST = "myhost";
    process.env.REDIS_PORT = "1234";

    jest.requireActual("@/configs/redis.config");

    const redisMock = jest.requireMock<{ createClient: jest.Mock }>("redis");
    expect(redisMock.createClient).toHaveBeenCalledWith({ url: "redis://myhost:1234" });
  });

  it("should register an error handler on the client", () => {
    process.env.NODE_ENV = "test";
    process.env.CLIENT_URL = "http://localhost:5173";
    process.env.REDIS_HOST = "localhost";
    process.env.REDIS_PORT = "6379";

    jest.requireActual("@/configs/redis.config");

    const redisMock = jest.requireMock<{ createClient: jest.Mock }>("redis");
    const mockClient = redisMock.createClient.mock.results[0]?.value as { on: jest.Mock };
    expect(mockClient.on).toHaveBeenCalledWith("error", expect.any(Function));
  });

  it("should log error when the error handler is triggered", () => {
    process.env.NODE_ENV = "test";
    process.env.CLIENT_URL = "http://localhost:5173";
    process.env.REDIS_HOST = "localhost";
    process.env.REDIS_PORT = "6379";
    jest.spyOn(console, "error").mockImplementation();

    jest.requireActual("@/configs/redis.config");

    const redisMock = jest.requireMock<{ createClient: jest.Mock }>("redis");
    const mockClient = redisMock.createClient.mock.results[0]?.value as { on: jest.Mock };
    const errorHandler = mockClient.on.mock.calls.find(
      (call: [string, unknown]) => call[0] === "error"
    )?.[1] as (error: Error) => void;
    const testError: Error = new Error("connection failed");

    errorHandler(testError);

    expect(console.error).toHaveBeenCalledWith("Redis connection error:", testError);
  });
});
