import type { IO, Socket } from "@/types/socket";
import type { Lobby, Room, Rooms, User, Users } from "@/types/app";
import type { ConnectPayload } from "@/types/payloads";

import { UserEvent } from "@/sockets/events/user.event";

import { RedisService } from "@/services/redis.service";

import { CODES_SUCCESS, CODES_ERROR } from "@/constants/codes.constant";
import { MESSAGES_SUCCESS, MESSAGES_ERROR } from "@/constants/messages.constant";
import { EVENTS_SOCKET_SERVER } from "@/constants/events.constant";
import { idLobby } from "@/constants/vars.constant";

import { mockLobby } from "@tests/__mocks__/lobby.mock";
import { mockUser } from "@tests/__mocks__/users.mock";

const mockedRedisService = RedisService as jest.Mocked<typeof RedisService>;

jest.mock("@/services/redis.service");

const buildMockIo = (): { io: IO; mockEmit: jest.Mock; mockTo: jest.Mock } => {
  const mockEmit: jest.Mock = jest.fn();
  const mockTo: jest.Mock = jest.fn().mockReturnValue({ emit: mockEmit });
  return { io: { to: mockTo } as unknown as IO, mockEmit, mockTo };
};

const buildMockSocket = (
  id = "socket-1"
): { socket: Socket; mockSocketEmit: jest.Mock; mockSocketTo: jest.Mock } => {
  const mockSocketEmit: jest.Mock = jest.fn();
  const mockSocketTo: jest.Mock = jest.fn().mockReturnValue({ emit: mockSocketEmit });
  return {
    socket: { id, to: mockSocketTo, join: jest.fn() } as unknown as Socket,
    mockSocketEmit,
    mockSocketTo,
  };
};

const buildRoom = (ownerId: string, players: string[] = [ownerId]): Room => ({
  id: "room-1",
  configuration: {
    name: "Test Room",
    slots: 6,
    type: "public",
    password: "",
    rounds: { totalRounds: 3, actualRound: 1 },
    countdown: { countdownGame: 60, countdownSelected: 60 },
  },
  players: players.map((pid: string) => ({
    id: pid,
    username: `user-${pid}`,
    actualRoom: "room-1",
    score: 0,
    isPainting: false,
    choosingAWord: false,
    alreadyPainted: false,
    guessed: false,
  })),
  started: false,
  owner: { id: ownerId, username: `user-${ownerId}`, actualRoom: "room-1" },
  wordToGuess: { actualWord: "", wordsToChoose: [], wordWithPlaceholder: "" },
});

const setupRedisState = (users: Users, rooms: Rooms, lobby: Lobby): void => {
  mockedRedisService.getUsers.mockResolvedValue(JSON.stringify(users));
  mockedRedisService.getRooms.mockResolvedValue(JSON.stringify(rooms));
  mockedRedisService.getLobby.mockResolvedValue(JSON.stringify(lobby));
  mockedRedisService.setUsers.mockResolvedValue(null);
  mockedRedisService.setRooms.mockResolvedValue(null);
  mockedRedisService.setLobby.mockResolvedValue(null);
};

describe("user.event", () => {
  describe("connect", () => {
    it("should create a new user and ack with ok", async () => {
      const { io, mockEmit, mockTo } = buildMockIo();
      const { socket } = buildMockSocket();
      const mockAck: jest.Mock = jest.fn();
      const payload: ConnectPayload = { username: "testuser", pathToRedirect: "/lobby" };
      setupRedisState({}, {}, mockLobby);

      await UserEvent.connect({ io, socket, payload, ack: mockAck });

      expect(mockAck).toHaveBeenCalledWith(
        expect.objectContaining({
          ok: true,
          code: CODES_SUCCESS.userConnected,
          message: MESSAGES_SUCCESS.userConnected,
        })
      );
      expect(mockedRedisService.setUsers).toHaveBeenCalled();
      expect(mockedRedisService.setLobby).toHaveBeenCalled();
      expect(mockTo).toHaveBeenCalledWith(idLobby);
      expect(mockEmit).toHaveBeenCalledWith(EVENTS_SOCKET_SERVER.UPDATE_LOBBY, expect.any(Object));
    });

    it("should return early when user already exists", async () => {
      const { io } = buildMockIo();
      const { socket } = buildMockSocket();
      const mockAck: jest.Mock = jest.fn();
      const payload: ConnectPayload = { username: "testuser", pathToRedirect: "/lobby" };
      setupRedisState({ "socket-1": mockUser }, {}, mockLobby);

      await UserEvent.connect({ io, socket, payload, ack: mockAck });

      expect(mockAck).toHaveBeenCalledWith(
        expect.objectContaining({
          ok: false,
          code: CODES_ERROR.generic,
          message: MESSAGES_ERROR.userAlreadyConnected,
        })
      );
      expect(mockedRedisService.setUsers).not.toHaveBeenCalled();
    });

    it("should ack with error when service throws", async () => {
      const { io } = buildMockIo();
      const { socket } = buildMockSocket();
      const mockAck: jest.Mock = jest.fn();
      const payload: ConnectPayload = { username: "testuser", pathToRedirect: "/lobby" };
      mockedRedisService.getLobby.mockRejectedValue(new Error("Redis down"));

      await UserEvent.connect({ io, socket, payload, ack: mockAck });

      expect(mockAck).toHaveBeenCalledWith(expect.objectContaining({ ok: false }));
    });
  });

  describe("disconnect", () => {
    it("should return early when user is not found", async () => {
      const { io } = buildMockIo();
      const { socket } = buildMockSocket();
      setupRedisState({}, {}, mockLobby);

      await UserEvent.disconnect({ io, socket });

      expect(mockedRedisService.setUsers).not.toHaveBeenCalled();
    });

    it("should remove user with no room and update lobby", async () => {
      const { io } = buildMockIo();
      const { socket, mockSocketTo, mockSocketEmit } = buildMockSocket();
      const user: User = { ...mockUser, actualRoom: "" };
      setupRedisState({ "socket-1": user }, {}, mockLobby);

      await UserEvent.disconnect({ io, socket });

      expect(mockedRedisService.setUsers).toHaveBeenCalled();
      expect(mockedRedisService.setLobby).toHaveBeenCalled();
      expect(mockSocketTo).toHaveBeenCalledWith(idLobby);
      expect(mockSocketEmit).toHaveBeenCalledWith(
        EVENTS_SOCKET_SERVER.UPDATE_LOBBY,
        expect.any(Object)
      );
    });

    it("should remove user from lobby and update lobby", async () => {
      const { io } = buildMockIo();
      const { socket, mockSocketTo, mockSocketEmit } = buildMockSocket();
      const user: User = { ...mockUser, actualRoom: idLobby };
      const lobby: Lobby = { ...mockLobby, users: [user] };
      setupRedisState({ "socket-1": user }, {}, lobby);

      await UserEvent.disconnect({ io, socket });

      expect(mockedRedisService.setUsers).toHaveBeenCalled();
      expect(mockedRedisService.setLobby).toHaveBeenCalled();
      expect(mockSocketTo).toHaveBeenCalledWith(idLobby);
      expect(mockSocketEmit).toHaveBeenCalledWith(
        EVENTS_SOCKET_SERVER.UPDATE_LOBBY,
        expect.any(Object)
      );
    });

    it("should delete room when owner disconnects", async () => {
      const { io, mockTo } = buildMockIo();
      const { socket, mockSocketTo, mockSocketEmit } = buildMockSocket();
      const user: User = { ...mockUser, actualRoom: "room-1" };
      const room: Room = buildRoom("socket-1");
      setupRedisState({ "socket-1": user }, { "room-1": room }, mockLobby);

      await UserEvent.disconnect({ io, socket });

      expect(mockedRedisService.setRooms).toHaveBeenCalled();
      expect(mockedRedisService.setUsers).toHaveBeenCalled();
      expect(mockTo).toHaveBeenCalledWith(idLobby);
      expect(mockSocketTo).toHaveBeenCalledWith("room-1");
      expect(mockSocketEmit).toHaveBeenCalledWith(
        EVENTS_SOCKET_SERVER.DISCONNECT,
        MESSAGES_ERROR.roomOwnerLeft
      );
    });

    it("should remove player from non-started room", async () => {
      const { io, mockTo } = buildMockIo();
      const { socket } = buildMockSocket("socket-2");
      const owner: User = { id: "socket-1", username: "owner", actualRoom: "room-1" };
      const player: User = { id: "socket-2", username: "player", actualRoom: "room-1" };
      const room: Room = buildRoom("socket-1", ["socket-1", "socket-2"]);
      setupRedisState({ "socket-1": owner, "socket-2": player }, { "room-1": room }, mockLobby);

      await UserEvent.disconnect({ io, socket });

      expect(mockedRedisService.setRooms).toHaveBeenCalled();
      expect(mockTo).toHaveBeenCalledWith("room-1");
    });

    it("should terminate started game when only one player remains", async () => {
      const { io, mockTo, mockEmit } = buildMockIo();
      const { socket } = buildMockSocket("socket-2");
      const owner: User = { id: "socket-1", username: "owner", actualRoom: "room-1" };
      const player: User = { id: "socket-2", username: "player", actualRoom: "room-1" };
      const room: Room = { ...buildRoom("socket-1", ["socket-1", "socket-2"]), started: true };
      setupRedisState({ "socket-1": owner, "socket-2": player }, { "room-1": room }, mockLobby);

      await UserEvent.disconnect({ io, socket });

      expect(mockedRedisService.setRooms).toHaveBeenCalled();
      expect(mockTo).toHaveBeenCalledWith("room-1");
      expect(mockEmit).toHaveBeenCalledWith(
        EVENTS_SOCKET_SERVER.DISCONNECT,
        MESSAGES_ERROR.gameLackOfPlayers
      );
    });

    it("should update room when player leaves started game with enough players", async () => {
      const { io, mockTo, mockEmit } = buildMockIo();
      const { socket } = buildMockSocket("socket-3");
      const owner: User = { id: "socket-1", username: "owner", actualRoom: "room-1" };
      const p2: User = { id: "socket-2", username: "p2", actualRoom: "room-1" };
      const p3: User = { id: "socket-3", username: "p3", actualRoom: "room-1" };
      const room: Room = {
        ...buildRoom("socket-1", ["socket-1", "socket-2", "socket-3"]),
        started: true,
      };
      setupRedisState(
        { "socket-1": owner, "socket-2": p2, "socket-3": p3 },
        { "room-1": room },
        mockLobby
      );

      await UserEvent.disconnect({ io, socket });

      expect(mockedRedisService.setRooms).toHaveBeenCalled();
      expect(mockTo).toHaveBeenCalledWith("room-1");
      expect(mockEmit).toHaveBeenCalledWith(EVENTS_SOCKET_SERVER.UPDATE_GAME, expect.any(Object));
    });
  });
});
