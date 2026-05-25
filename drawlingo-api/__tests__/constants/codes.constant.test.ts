import { CODES_SUCCESS, CODES_ERROR, CODES_NOT } from "@/constants/codes.constant";

describe("codes.constant", () => {
  describe("CODES_SUCCESS", () => {
    it("should expose the expected success codes", () => {
      expect(CODES_SUCCESS.healthLive).toBe("SUCCESS_HEALTH_LIVE");
      expect(CODES_SUCCESS.healthReady).toBe("SUCCESS_HEALTH_READY");
      expect(CODES_SUCCESS.userConnected).toBe("USER_CONNECTED");
      expect(CODES_SUCCESS.lobbyJoined).toBe("LOBBY_JOINED");
      expect(CODES_SUCCESS.roomCreated).toBe("ROOM_CREATED");
      expect(CODES_SUCCESS.gameStarted).toBe("GAME_STARTED");
    });

    it("should not have duplicate values", () => {
      const values: string[] = Object.values(CODES_SUCCESS);
      const unique = new Set(values);

      expect(unique.size).toBe(values.length);
    });
  });

  describe("CODES_ERROR", () => {
    it("should expose the expected error codes", () => {
      expect(CODES_ERROR.generic).toBe("ERROR_GENERIC");
      expect(CODES_ERROR.redis).toBe("ERROR_REDIS");
      expect(CODES_ERROR.validation).toBe("ERROR_VALIDATION");
    });
  });

  describe("CODES_NOT", () => {
    it("should expose the not found code", () => {
      expect(CODES_NOT.foundRoute).toBe("NOT_FOUND_ROUTE");
    });
  });
});
