import { execSync } from "child_process";

module.exports = async () => {
  console.log("Stopping Redis container...");
  try {
    // Detiene el contenedor Redis
    execSync("docker-compose down", { stdio: "inherit" });
    console.log("Redis container stopped!");
  } catch (error) {
    console.error("Error stopping Redis container:", error);
  }
};