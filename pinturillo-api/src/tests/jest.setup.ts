import { execSync } from "child_process";

// ENVS
process.env.REDIS_HOST = "redis";
process.env.REDIS_HOST = "6379";
process.env.PORT = "5000";
process.env.CLIENT_URL = "http://localhost:5173";

module.exports = async () => {
  console.log("Starting Redis container...");
  try {
    // Levanta el contenedor Redis si no está corriendo
    execSync("docker-compose up -d redis", { stdio: "inherit" });
    console.log("Redis container is running!");
  } catch (error) {
    console.error("Error starting Redis container:", error);
    throw error;
  }
};
