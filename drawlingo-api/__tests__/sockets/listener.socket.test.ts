import type { IO, Socket } from "@/types/socket";

import { registerSocketHandlers } from "@/sockets/listener.socket";

import { EVENTS_SOCKET_CLIENT } from "@/constants/events.constant";

jest.mock("uuid", () => ({ v4: jest.fn() }));

describe("listener.socket", () => {
  describe("registerSocketHandlers", () => {
    it("should register all client event handlers", () => {
      const mockOn: jest.Mock = jest.fn();
      const mockSocket: Socket = { on: mockOn } as unknown as Socket;
      const mockIo: IO = {} as IO;

      registerSocketHandlers(mockIo, mockSocket);

      const registeredEvents: string[] = mockOn.mock.calls.map(
        (call: [string, unknown]) => call[0]
      );
      expect(registeredEvents).toContain(EVENTS_SOCKET_CLIENT.CONNECT);
      expect(registeredEvents).toContain("disconnect");
      expect(registeredEvents).toContain(EVENTS_SOCKET_CLIENT.JOIN_LOBBY);
      expect(registeredEvents).toContain(EVENTS_SOCKET_CLIENT.LEAVE_LOBBY);
      expect(registeredEvents).toContain(EVENTS_SOCKET_CLIENT.SEND_MESSAGE_LOBBY);
      expect(registeredEvents).toContain(EVENTS_SOCKET_CLIENT.CREATE_ROOM);
      expect(registeredEvents).toContain(EVENTS_SOCKET_CLIENT.JOIN_ROOM_LOBBY);
      expect(registeredEvents).toContain(EVENTS_SOCKET_CLIENT.LOGIN_PRIVATE_ROOM);
      expect(registeredEvents).toContain(EVENTS_SOCKET_CLIENT.START_GAME);
      expect(registeredEvents).toContain(EVENTS_SOCKET_CLIENT.JOIN_GAME);
      expect(registeredEvents).toContain(EVENTS_SOCKET_CLIENT.WORD_SELECTED_GAME);
      expect(registeredEvents).toContain(EVENTS_SOCKET_CLIENT.CANVAS_IMAGE_GAME);
      expect(registeredEvents).toContain(EVENTS_SOCKET_CLIENT.CANVAS_CLEAR_GAME);
      expect(registeredEvents).toContain(EVENTS_SOCKET_CLIENT.COUNTDOWN_GAME);
      expect(registeredEvents).toContain(EVENTS_SOCKET_CLIENT.SEND_MESSAGE_GAME);
      expect(registeredEvents).toContain(EVENTS_SOCKET_CLIENT.NEW_PAINTER_GAME);
      expect(registeredEvents).toContain(EVENTS_SOCKET_CLIENT.NEXT_ROUND_GAME);
      expect(registeredEvents).toContain(EVENTS_SOCKET_CLIENT.FINISH_GAME);
    });

    it("should register a handler for each event as a function", () => {
      const mockOn: jest.Mock = jest.fn();
      const mockSocket: Socket = { on: mockOn } as unknown as Socket;
      const mockIo: IO = {} as IO;

      registerSocketHandlers(mockIo, mockSocket);

      mockOn.mock.calls.forEach((call: [string, unknown]) => {
        expect(typeof call[1]).toBe("function");
      });
    });
  });
});
