import { MESSAGES_SUCCESS, MESSAGES_ERROR, MESSAGES_NOT } from "@/constants/messages.constant";

describe("messages.constant", () => {
  describe("MESSAGES_SUCCESS", () => {
    it("should expose the expected success messages", () => {
      expect(MESSAGES_SUCCESS.healthLive).toBe("Service is alive.");
      expect(MESSAGES_SUCCESS.healthReady).toBe("Service is ready.");
      expect(MESSAGES_SUCCESS.userConnected).toBe("Connected successfully.");
    });

    it("should have a value for every key", () => {
      const values: string[] = Object.values(MESSAGES_SUCCESS);

      values.forEach((value: string) => {
        expect(typeof value).toBe("string");
        expect(value.length).toBeGreaterThan(0);
      });
    });
  });

  describe("MESSAGES_ERROR", () => {
    it("should expose the expected error messages", () => {
      expect(MESSAGES_ERROR.generic).toBe("Something went wrong!");
      expect(MESSAGES_ERROR.redis).toBe("Something went wrong with Redis!");
      expect(MESSAGES_ERROR.validation).toBe("Validation failed.");
      expect(MESSAGES_ERROR.userAlreadyConnected).toBe("User already connected.");
      expect(MESSAGES_ERROR.roomOwnerLeft).toBe("The owner of the room left");
      expect(MESSAGES_ERROR.gameLackOfPlayers).toBe("Game terminated due to lack of players");
      expect(MESSAGES_ERROR.roomNotFound).toBe("There is no room with the entered ID.");
      expect(MESSAGES_ERROR.roomNotPrivate).toBe(
        "The room you want to connect to is public, not private."
      );
      expect(MESSAGES_ERROR.roomPasswordIncorrect).toBe("The password entered is incorrect.");
    });
  });

  describe("MESSAGES_NOT", () => {
    it("should expose the not found message", () => {
      expect(MESSAGES_NOT.foundRoute).toBe("Route not found.");
    });
  });
});
