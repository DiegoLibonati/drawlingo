import { mockEnvs } from "@tests/__mocks__/envs.mock";

process.env.CLIENT_URL = mockEnvs.CLIENT_URL || "http://localhost:5173";
process.env.NODE_ENV = mockEnvs.NODE_ENV || "test";
process.env.REDIS_HOST = mockEnvs.REDIS_HOST || "localhost";
process.env.REDIS_PORT = mockEnvs.REDIS_PORT || "6379";
