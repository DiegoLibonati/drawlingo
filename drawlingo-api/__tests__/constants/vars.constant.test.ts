import {
  idLobby,
  WORDS,
  INITIAL_USERS,
  INITIAL_ROOMS,
  INITIAL_LOBBY,
} from "@/constants/vars.constant";

describe("vars.constant", () => {
  describe("idLobby", () => {
    it("should be lobby_room", () => {
      expect(idLobby).toBe("lobby_room");
    });
  });

  describe("WORDS", () => {
    it("should be an array of strings", () => {
      expect(Array.isArray(WORDS)).toBe(true);

      WORDS.forEach((word: string) => {
        expect(typeof word).toBe("string");
        expect(word.length).toBeGreaterThan(0);
      });
    });

    it("should contain at least 4 words", () => {
      expect(WORDS.length).toBeGreaterThanOrEqual(4);
    });
  });

  describe("INITIAL_USERS", () => {
    it("should be an empty object", () => {
      expect(INITIAL_USERS).toEqual({});
    });
  });

  describe("INITIAL_ROOMS", () => {
    it("should be an empty object", () => {
      expect(INITIAL_ROOMS).toEqual({});
    });
  });

  describe("INITIAL_LOBBY", () => {
    it("should have the correct initial shape", () => {
      expect(INITIAL_LOBBY.id).toBe(idLobby);
      expect(INITIAL_LOBBY.appTotalPlayers).toBe(0);
      expect(INITIAL_LOBBY.users).toEqual([]);
      expect(INITIAL_LOBBY.rooms).toEqual({});
    });
  });
});
