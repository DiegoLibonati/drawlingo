import { execSync } from "child_process";

module.exports = async () => {
  try {
    console.log("Stopping Redis container...");

    execSync(
      "docker-compose --env-file ../.env -f ../dev.docker-compose.yml down",
      { stdio: "inherit" }
    );

    console.log("Redis container stopped!");
  } catch (e) {
    console.error("Error stopping Redis container:", e);
    return e;
  }
};
