import { execSync } from "child_process";

module.exports = async () => {
  console.log("Starting db container...");
  try {
    // Levanta el contenedor Redis si no está corriendo
    execSync("docker-compose -f ../dev.docker-compose.yml up -d redis", { stdio: "inherit" });
    console.log("Redis container is running!");
  } catch (error) {
    console.error("Error starting db container:", error);
    throw error;
  }
};

