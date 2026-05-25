import { EVENTS_SOCKET_CLIENT, EVENTS_SOCKET_SERVER } from "@/constants/events.constant";

describe("events.constant", () => {
  describe("EVENTS_SOCKET_CLIENT", () => {
    it("should expose all client event names", () => {
      expect(EVENTS_SOCKET_CLIENT.CONNECT).toBe("custom connect");
      expect(EVENTS_SOCKET_CLIENT.DISCONNECT).toBe("disconnect");
      expect(EVENTS_SOCKET_CLIENT.JOIN_LOBBY).toBe("join lobby");
      expect(EVENTS_SOCKET_CLIENT.CREATE_ROOM).toBe("create room");
      expect(EVENTS_SOCKET_CLIENT.START_GAME).toBe("start game");
    });

    it("should not have duplicate values", () => {
      const values: string[] = Object.values(EVENTS_SOCKET_CLIENT);
      const unique = new Set(values);

      expect(unique.size).toBe(values.length);
    });
  });

  describe("EVENTS_SOCKET_SERVER", () => {
    it("should expose all server event names", () => {
      expect(EVENTS_SOCKET_SERVER.CONNECT).toBe("custom connect");
      expect(EVENTS_SOCKET_SERVER.DISCONNECT).toBe("custom disconnect");
      expect(EVENTS_SOCKET_SERVER.UPDATE_LOBBY).toBe("update lobby");
      expect(EVENTS_SOCKET_SERVER.UPDATE_GAME).toBe("update game");
    });

    it("should not have duplicate values", () => {
      const values: string[] = Object.values(EVENTS_SOCKET_SERVER);
      const unique = new Set(values);

      expect(unique.size).toBe(values.length);
    });
  });
});
