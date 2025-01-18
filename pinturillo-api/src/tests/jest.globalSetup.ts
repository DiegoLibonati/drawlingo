import { execSync } from "child_process";

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
