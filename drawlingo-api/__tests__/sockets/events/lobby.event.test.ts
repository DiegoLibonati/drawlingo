import type { IO, Socket } from "@/types/socket";
import type { Lobby, Rooms, User, Users } from "@/types/app";

import { LobbyEvent } from "@/sockets/events/lobby.event";

import { RedisService } from "@/services/redis.service";

import { CODES_SUCCESS, CODES_ERROR } from "@/constants/codes.constant";
import { MESSAGES_SUCCESS, MESSAGES_ERROR } from "@/constants/messages.constant";
import { EVENTS_SOCKET_SERVER } from "@/constants/events.constant";
import { idLobby } from "@/constants/vars.constant";

import { mockUser } from "@tests/__mocks__/users.mock";
import { mockLobby } from "@tests/__mocks__/lobby.mock";

const mockedRedisService = RedisService as jest.Mocked<typeof RedisService>;

jest.mock("@/services/redis.service");
jest.mock("uuid", () => ({ v4: jest.fn() }));

const getMockedUuidV4 = (): jest.Mock => {
  const { v4 } = jest.requireMock("uuid");
  return v4 as jest.Mock;
};

const buildMockIo = (): { io: IO; mockEmit: jest.Mock; mockTo: jest.Mock } => {
  const mockEmit: jest.Mock = jest.fn();
  const mockTo: jest.Mock = jest.fn().mockReturnValue({ emit: mockEmit });
  return { io: { to: mockTo } as unknown as IO, mockEmit, mockTo };
};

const buildMockSocket = (id = "socket-1"): { socket: Socket; mockJoin: jest.Mock } => {
  const mockJoin: jest.Mock = jest.fn().mockResolvedValue(undefined);
  return {
    socket: { id, join: mockJoin } as unknown as Socket,
    mockJoin,
  };
};

const setupRedisState = (users: Users, rooms: Rooms, lobby: Lobby): void => {
  mockedRedisService.getUsers.mockResolvedValue(JSON.stringify(users));
  mockedRedisService.getRooms.mockResolvedValue(JSON.stringify(rooms));
  mockedRedisService.getLobby.mockResolvedValue(JSON.stringify(lobby));
  mockedRedisService.setUsers.mockResolvedValue(null);
  mockedRedisService.setRooms.mockResolvedValue(null);
  mockedRedisService.setLobby.mockResolvedValue(null);
};

describe("lobby.event", () => {
  describe("join", () => {
    it("should join the lobby and ack with ok", async () => {
      const { io, mockTo, mockEmit } = buildMockIo();
      const { socket, mockJoin } = buildMockSocket();
      const mockAck: jest.Mock = jest.fn();
      setupRedisState({ "socket-1": mockUser }, {}, mockLobby);

      await LobbyEvent.join({ io, socket, ack: mockAck });

      expect(mockJoin).toHaveBeenCalledWith(idLobby);
      expect(mockAck).toHaveBeenCalledWith(
        expect.objectContaining({
          ok: true,
          code: CODES_SUCCESS.lobbyJoined,
          message: MESSAGES_SUCCESS.lobbyJoined,
        })
      );
      expect(mockedRedisService.setLobby).toHaveBeenCalled();
      expect(mockedRedisService.setUsers).toHaveBeenCalled();
      expect(mockTo).toHaveBeenCalledWith(idLobby);
      expect(mockEmit).toHaveBeenCalledWith(EVENTS_SOCKET_SERVER.UPDATE_LOBBY, expect.any(Object));
    });

    it("should ack with error when user does not exist", async () => {
      const { io } = buildMockIo();
      const { socket } = buildMockSocket();
      const mockAck: jest.Mock = jest.fn();
      setupRedisState({}, {}, mockLobby);

      await LobbyEvent.join({ io, socket, ack: mockAck });

      expect(mockAck).toHaveBeenCalledWith(
        expect.objectContaining({
          ok: false,
          code: CODES_ERROR.generic,
          message: MESSAGES_ERROR.generic,
        })
      );
    });

    it("should ack with error when service throws", async () => {
      const { io } = buildMockIo();
      const { socket } = buildMockSocket();
      const mockAck: jest.Mock = jest.fn();
      mockedRedisService.getUsers.mockRejectedValue(new Error("Redis down"));

      await LobbyEvent.join({ io, socket, ack: mockAck });

      expect(mockAck).toHaveBeenCalledWith(expect.objectContaining({ ok: false }));
    });
  });

  describe("leave", () => {
    it("should leave the lobby and ack with ok", async () => {
      const { io, mockTo } = buildMockIo();
      const { socket } = buildMockSocket();
      const mockAck: jest.Mock = jest.fn();
      const user: User = { ...mockUser, actualRoom: idLobby };
      const lobby: Lobby = { ...mockLobby, users: [user] };
      setupRedisState({ "socket-1": user }, {}, lobby);

      await LobbyEvent.leave({ io, socket, ack: mockAck });

      expect(mockAck).toHaveBeenCalledWith(
        expect.objectContaining({
          ok: true,
          code: CODES_SUCCESS.lobbyLeft,
          message: MESSAGES_SUCCESS.lobbyLeft,
        })
      );
      expect(mockedRedisService.setUsers).toHaveBeenCalled();
      expect(mockedRedisService.setLobby).toHaveBeenCalled();
      expect(mockTo).toHaveBeenCalledWith(idLobby);
    });

    it("should ack with error when user does not exist", async () => {
      const { io } = buildMockIo();
      const { socket } = buildMockSocket();
      const mockAck: jest.Mock = jest.fn();
      setupRedisState({}, {}, mockLobby);

      await LobbyEvent.leave({ io, socket, ack: mockAck });

      expect(mockAck).toHaveBeenCalledWith(
        expect.objectContaining({
          ok: false,
          code: CODES_ERROR.generic,
          message: MESSAGES_ERROR.generic,
        })
      );
    });

    it("should ack with error when service throws", async () => {
      const { io } = buildMockIo();
      const { socket } = buildMockSocket();
      const mockAck: jest.Mock = jest.fn();
      mockedRedisService.getLobby.mockRejectedValue(new Error("Redis down"));

      await LobbyEvent.leave({ io, socket, ack: mockAck });

      expect(mockAck).toHaveBeenCalledWith(expect.objectContaining({ ok: false }));
    });
  });

  describe("sendMessage", () => {
    it("should send a message and ack with ok", async () => {
      getMockedUuidV4().mockReturnValue("mock-uuid");
      const { io, mockTo, mockEmit } = buildMockIo();
      const { socket } = buildMockSocket();
      const mockAck: jest.Mock = jest.fn();
      setupRedisState({ "socket-1": mockUser }, {}, mockLobby);

      await LobbyEvent.sendMessage({ io, socket, message: "hello", ack: mockAck });

      expect(mockAck).toHaveBeenCalledWith(
        expect.objectContaining({
          ok: true,
          code: CODES_SUCCESS.lobbyMessageSent,
          message: MESSAGES_SUCCESS.lobbyMessageSent,
        })
      );
      expect(mockTo).toHaveBeenCalledWith(idLobby);
      expect(mockEmit).toHaveBeenCalledWith(
        EVENTS_SOCKET_SERVER.SEND_MESSAGE_LOBBY,
        expect.objectContaining({ id: "mock-uuid", message: "hello" })
      );
    });

    it("should ack with error when service throws", async () => {
      const { io } = buildMockIo();
      const { socket } = buildMockSocket();
      const mockAck: jest.Mock = jest.fn();
      mockedRedisService.getUsers.mockRejectedValue(new Error("Redis down"));

      await LobbyEvent.sendMessage({ io, socket, message: "hello", ack: mockAck });

      expect(mockAck).toHaveBeenCalledWith(expect.objectContaining({ ok: false }));
    });
  });
});
