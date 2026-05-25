import type { IO, Socket } from "@/types/socket";
import type { Lobby, Room, Rooms, User, Users } from "@/types/app";
import type { LoginPrivateRoomPayload } from "@/types/payloads";

import { RoomEvent } from "@/sockets/events/room.event";

import { RedisService } from "@/services/redis.service";

import { CODES_SUCCESS, CODES_ERROR } from "@/constants/codes.constant";
import { MESSAGES_SUCCESS, MESSAGES_ERROR } from "@/constants/messages.constant";
import { EVENTS_SOCKET_SERVER } from "@/constants/events.constant";
import { idLobby } from "@/constants/vars.constant";

import { mockUser } from "@tests/__mocks__/users.mock";
import { mockLobby } from "@tests/__mocks__/lobby.mock";
import { mockOptionsRoom } from "@tests/__mocks__/rooms.mock";

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

const buildRoom = (overrides: Partial<Room> = {}): Room => ({
  id: "room-1",
  configuration: {
    name: "Test Room",
    slots: 6,
    type: "public",
    password: "",
    rounds: { totalRounds: 3, actualRound: 1 },
    countdown: { countdownGame: 60, countdownSelected: 60 },
  },
  players: [
    {
      ...mockUser,
      actualRoom: "room-1",
      score: 0,
      isPainting: false,
      choosingAWord: false,
      alreadyPainted: false,
      guessed: false,
    },
  ],
  started: false,
  owner: { ...mockUser, actualRoom: "room-1" },
  wordToGuess: { actualWord: "", wordsToChoose: [], wordWithPlaceholder: "" },
  ...overrides,
});

const setupRedisState = (users: Users, rooms: Rooms, lobby: Lobby): void => {
  mockedRedisService.getUsers.mockResolvedValue(JSON.stringify(users));
  mockedRedisService.getRooms.mockResolvedValue(JSON.stringify(rooms));
  mockedRedisService.getLobby.mockResolvedValue(JSON.stringify(lobby));
  mockedRedisService.setUsers.mockResolvedValue(null);
  mockedRedisService.setRooms.mockResolvedValue(null);
  mockedRedisService.setLobby.mockResolvedValue(null);
};

describe("room.event", () => {
  describe("create", () => {
    it("should create a room and ack with ok", async () => {
      getMockedUuidV4().mockReturnValue("mock-room-uuid");
      const { io, mockTo, mockEmit } = buildMockIo();
      const { socket, mockJoin } = buildMockSocket();
      const mockAck: jest.Mock = jest.fn();
      setupRedisState({ "socket-1": mockUser }, {}, mockLobby);

      await RoomEvent.create({ io, socket, optionsRoom: mockOptionsRoom, ack: mockAck });

      expect(mockJoin).toHaveBeenCalledWith("mock-room-uuid");
      expect(mockAck).toHaveBeenCalledWith(
        expect.objectContaining({
          ok: true,
          code: CODES_SUCCESS.roomCreated,
          message: MESSAGES_SUCCESS.roomCreated,
          data: { idRoom: "mock-room-uuid" },
        })
      );
      expect(mockedRedisService.setUsers).toHaveBeenCalled();
      expect(mockedRedisService.setRooms).toHaveBeenCalled();
      expect(mockedRedisService.setLobby).toHaveBeenCalled();
      expect(mockTo).toHaveBeenCalledWith(idLobby);
      expect(mockEmit).toHaveBeenCalledWith(EVENTS_SOCKET_SERVER.UPDATE_LOBBY, expect.any(Object));
    });

    it("should ack with error when service throws", async () => {
      const { io } = buildMockIo();
      const { socket } = buildMockSocket();
      const mockAck: jest.Mock = jest.fn();
      mockedRedisService.getUsers.mockRejectedValue(new Error("Redis down"));

      await RoomEvent.create({ io, socket, optionsRoom: mockOptionsRoom, ack: mockAck });

      expect(mockAck).toHaveBeenCalledWith(expect.objectContaining({ ok: false }));
    });
  });

  describe("join", () => {
    it("should join an existing room and ack with ok", async () => {
      const { io } = buildMockIo();
      const { socket, mockJoin } = buildMockSocket("socket-2");
      const mockAck: jest.Mock = jest.fn();
      const joiner: User = { id: "socket-2", username: "joiner", actualRoom: idLobby };
      const room: Room = buildRoom();
      const lobby: Lobby = { ...mockLobby, users: [mockUser, joiner] };
      setupRedisState({ "socket-1": mockUser, "socket-2": joiner }, { "room-1": room }, lobby);

      await RoomEvent.join({ io, socket, idRoom: "room-1", ack: mockAck });

      expect(mockJoin).toHaveBeenCalledWith("room-1");
      expect(mockAck).toHaveBeenCalledWith(
        expect.objectContaining({
          ok: true,
          code: CODES_SUCCESS.roomJoined,
        })
      );
    });

    it("should ack with ok without joining when user is the owner", async () => {
      const { io } = buildMockIo();
      const { socket, mockJoin } = buildMockSocket();
      const mockAck: jest.Mock = jest.fn();
      const room: Room = buildRoom();
      setupRedisState({ "socket-1": mockUser }, { "room-1": room }, mockLobby);

      await RoomEvent.join({ io, socket, idRoom: "room-1", ack: mockAck });

      expect(mockAck).toHaveBeenCalledWith(
        expect.objectContaining({
          ok: true,
          code: CODES_SUCCESS.roomJoined,
        })
      );
      expect(mockJoin).not.toHaveBeenCalled();
    });

    it("should ack with error when room does not exist", async () => {
      const { io } = buildMockIo();
      const { socket } = buildMockSocket();
      const mockAck: jest.Mock = jest.fn();
      setupRedisState({ "socket-1": mockUser }, {}, mockLobby);

      await RoomEvent.join({ io, socket, idRoom: "nonexistent", ack: mockAck });

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

      await RoomEvent.join({ io, socket, idRoom: "room-1", ack: mockAck });

      expect(mockAck).toHaveBeenCalledWith(expect.objectContaining({ ok: false }));
    });
  });

  describe("loginPrivate", () => {
    it("should ack with ok when password matches", async () => {
      const { io } = buildMockIo();
      const { socket } = buildMockSocket();
      const mockAck: jest.Mock = jest.fn();
      const room: Room = buildRoom({
        configuration: {
          name: "Private",
          slots: 6,
          type: "private",
          password: "secret",
          rounds: { totalRounds: 3, actualRound: 1 },
          countdown: { countdownGame: 60, countdownSelected: 60 },
        },
      });
      const payload: LoginPrivateRoomPayload = { idRoom: "room-1", password: "secret" };
      setupRedisState({}, { "room-1": room }, mockLobby);

      await RoomEvent.loginPrivate({ io, socket, payload, ack: mockAck });

      expect(mockAck).toHaveBeenCalledWith(
        expect.objectContaining({
          ok: true,
          code: CODES_SUCCESS.roomPrivateLogin,
        })
      );
    });

    it("should ack with error when room does not exist", async () => {
      const { io } = buildMockIo();
      const { socket } = buildMockSocket();
      const mockAck: jest.Mock = jest.fn();
      const payload: LoginPrivateRoomPayload = { idRoom: "nonexistent", password: "secret" };
      setupRedisState({}, {}, mockLobby);

      await RoomEvent.loginPrivate({ io, socket, payload, ack: mockAck });

      expect(mockAck).toHaveBeenCalledWith(expect.objectContaining({ ok: false }));
    });

    it("should ack with error when room is not private", async () => {
      const { io } = buildMockIo();
      const { socket } = buildMockSocket();
      const mockAck: jest.Mock = jest.fn();
      const room: Room = buildRoom();
      const payload: LoginPrivateRoomPayload = { idRoom: "room-1", password: "" };
      setupRedisState({}, { "room-1": room }, mockLobby);

      await RoomEvent.loginPrivate({ io, socket, payload, ack: mockAck });

      expect(mockAck).toHaveBeenCalledWith(expect.objectContaining({ ok: false }));
    });

    it("should ack with error when password is incorrect", async () => {
      const { io } = buildMockIo();
      const { socket } = buildMockSocket();
      const mockAck: jest.Mock = jest.fn();
      const room: Room = buildRoom({
        configuration: {
          name: "Private",
          slots: 6,
          type: "private",
          password: "secret",
          rounds: { totalRounds: 3, actualRound: 1 },
          countdown: { countdownGame: 60, countdownSelected: 60 },
        },
      });
      const payload: LoginPrivateRoomPayload = { idRoom: "room-1", password: "wrong" };
      setupRedisState({}, { "room-1": room }, mockLobby);

      await RoomEvent.loginPrivate({ io, socket, payload, ack: mockAck });

      expect(mockAck).toHaveBeenCalledWith(expect.objectContaining({ ok: false }));
    });

    it("should ack with error when service throws", async () => {
      const { io } = buildMockIo();
      const { socket } = buildMockSocket();
      const mockAck: jest.Mock = jest.fn();
      const payload: LoginPrivateRoomPayload = { idRoom: "room-1", password: "x" };
      mockedRedisService.getRooms.mockRejectedValue(new Error("Redis down"));

      await RoomEvent.loginPrivate({ io, socket, payload, ack: mockAck });

      expect(mockAck).toHaveBeenCalledWith(expect.objectContaining({ ok: false }));
    });
  });
});
