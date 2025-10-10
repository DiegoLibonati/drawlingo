import { execSync } from "child_process";

export default async () => {
  console.log("🚀 Starting test database container...");

  try {
    process.env.REDIS_HOST = "redis";
    process.env.REDIS_HOST = "6379";

    process.env.PORT = "5000";
    process.env.NODE_ENV = "testing";

    process.env.CLIENT_URL = "http://pinturillo-vue:5173";

    execSync("docker-compose -f ../dev.docker-compose.yml up -d redis", {
      stdio: "inherit",
    });

    console.log("Redis container is running!");

    await new Promise((res) => setTimeout(res, 5000));
  } catch (error) {
    console.error("Error starting redis container:", error);
    throw error;
  }
};
