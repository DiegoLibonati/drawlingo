import { execSync } from "child_process";

export default async () => {
  console.log("Stopping test redis container...");
  try {
    execSync(
      `docker-compose -f ../dev.docker-compose.yml down -v --remove-orphans`,
      {
        stdio: "inherit",
      }
    );
    console.log("Redis container stopped!");
  } catch (error) {
    console.error("Error stopping redis container:", error);
  }
};
