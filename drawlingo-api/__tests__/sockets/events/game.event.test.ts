import type { IO, Socket } from "@/types/socket";
import type { Lobby, Player, Room, Rooms, User, Users } from "@/types/app";
import type {
  CanvasImagePayload,
  SendMessageGamePayload,
  WordSelectedPayload,
} from "@/types/payloads";

import { GameEvent } from "@/sockets/events/game.event";

import { RedisService } from "@/services/redis.service";

import { CODES_SUCCESS, CODES_ERROR } from "@/constants/codes.constant";
import { MESSAGES_SUCCESS } from "@/constants/messages.constant";
import { EVENTS_SOCKET_SERVER } from "@/constants/events.constant";
import { idLobby } from "@/constants/vars.constant";

import { mockUser } from "@tests/__mocks__/users.mock";
import { mockLobby } from "@tests/__mocks__/lobby.mock";

const mockedRedisService = RedisService as jest.Mocked<typeof RedisService>;

jest.mock("@/services/redis.service");
jest.mock("uuid", () => ({ v4: jest.fn() }));

const setupUuidMock = (value = "mock-msg-uuid"): void => {
  const { v4 } = jest.requireMock("uuid");
  v4.mockReturnValue(value);
};

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

const buildPlayer = (overrides: Partial<Player> = {}): Player => ({
  id: "socket-1",
  username: "painter",
  actualRoom: "room-1",
  score: 0,
  isPainting: false,
  choosingAWord: false,
  alreadyPainted: false,
  guessed: false,
  ...overrides,
});

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
    buildPlayer({ id: "socket-1", isPainting: true, choosingAWord: false }),
    buildPlayer({ id: "socket-2", username: "guesser" }),
  ],
  started: true,
  owner: mockUser,
  wordToGuess: { actualWord: "ARBOL", wordsToChoose: [], wordWithPlaceholder: "_ _ _ _ _" },
  ...overrides,
});

const setupRedisState = (rooms: Rooms, users?: Users, lobby?: Lobby): void => {
  mockedRedisService.getRooms.mockResolvedValue(JSON.stringify(rooms));
  mockedRedisService.getUsers.mockResolvedValue(JSON.stringify(users ?? {}));
  mockedRedisService.getLobby.mockResolvedValue(JSON.stringify(lobby ?? mockLobby));
  mockedRedisService.setRooms.mockResolvedValue(null);
  mockedRedisService.setUsers.mockResolvedValue(null);
  mockedRedisService.setLobby.mockResolvedValue(null);
};

describe("game.event", () => {
  describe("start", () => {
    it("should ack with ok and emit start game to room", () => {
      const { io, mockTo, mockEmit } = buildMockIo();
      const { socket } = buildMockSocket();
      const mockAck: jest.Mock = jest.fn();

      GameEvent.start({ io, socket, idRoom: "room-1", ack: mockAck });

      expect(mockAck).toHaveBeenCalledWith({
        ok: true,
        code: CODES_SUCCESS.gameStarted,
        message: MESSAGES_SUCCESS.gameStarted,
        data: null,
      });
      expect(mockTo).toHaveBeenCalledWith("room-1");
      expect(mockEmit).toHaveBeenCalledWith(EVENTS_SOCKET_SERVER.START_GAME);
    });

    it("should ack with error when an exception occurs", () => {
      const mockTo: jest.Mock = jest.fn().mockImplementation(() => {
        throw new Error("boom");
      });
      const io: IO = { to: mockTo } as unknown as IO;
      const { socket } = buildMockSocket();
      const mockAck: jest.Mock = jest.fn();

      GameEvent.start({ io, socket, idRoom: "room-1", ack: mockAck });

      expect(mockAck).toHaveBeenCalledWith(expect.objectContaining({ ok: false }));
    });
  });

  describe("join", () => {
    it("should set first player as painter and ack with ok", async () => {
      const { io, mockTo } = buildMockIo();
      const { socket } = buildMockSocket();
      const mockAck: jest.Mock = jest.fn();
      const room: Room = buildRoom({ started: false });
      setupRedisState({ "room-1": room }, {}, mockLobby);

      await GameEvent.join({ io, socket, idRoom: "room-1", ack: mockAck });

      expect(mockAck).toHaveBeenCalledWith(
        expect.objectContaining({
          ok: true,
          code: CODES_SUCCESS.gameJoined,
        })
      );
      expect(mockedRedisService.setRooms).toHaveBeenCalled();
      expect(mockedRedisService.setLobby).toHaveBeenCalled();
      expect(mockTo).toHaveBeenCalledWith(idLobby);
      expect(mockTo).toHaveBeenCalledWith("room-1");
    });

    it("should ack with error when service throws", async () => {
      const { io } = buildMockIo();
      const { socket } = buildMockSocket();
      const mockAck: jest.Mock = jest.fn();
      mockedRedisService.getLobby.mockRejectedValue(new Error("Redis down"));

      await GameEvent.join({ io, socket, idRoom: "room-1", ack: mockAck });

      expect(mockAck).toHaveBeenCalledWith(expect.objectContaining({ ok: false }));
    });
  });

  describe("wordSelected", () => {
    it("should update the room with selected word and ack with ok", async () => {
      const { io, mockTo, mockEmit } = buildMockIo();
      const { socket } = buildMockSocket();
      const mockAck: jest.Mock = jest.fn();
      const room: Room = buildRoom({
        players: [buildPlayer({ choosingAWord: true, isPainting: true })],
      });
      const payload: WordSelectedPayload = { idRoom: "room-1", wordSelected: "CAMINO" };
      setupRedisState({ "room-1": room });

      await GameEvent.wordSelected({ io, socket, payload, ack: mockAck });

      expect(mockAck).toHaveBeenCalledWith(
        expect.objectContaining({
          ok: true,
          code: CODES_SUCCESS.wordSelected,
        })
      );
      expect(mockedRedisService.setRooms).toHaveBeenCalled();
      expect(mockTo).toHaveBeenCalledWith("room-1");
      expect(mockEmit).toHaveBeenCalledWith(EVENTS_SOCKET_SERVER.UPDATE_GAME, expect.any(Object));
    });

    it("should ack with error when room does not exist", async () => {
      const { io } = buildMockIo();
      const { socket } = buildMockSocket();
      const mockAck: jest.Mock = jest.fn();
      const payload: WordSelectedPayload = { idRoom: "nonexistent", wordSelected: "CAMINO" };
      setupRedisState({});

      await GameEvent.wordSelected({ io, socket, payload, ack: mockAck });

      expect(mockAck).toHaveBeenCalledWith(
        expect.objectContaining({ ok: false, code: CODES_ERROR.generic })
      );
    });
  });

  describe("canvasImage", () => {
    it("should ack with ok and emit image to room", () => {
      const { io } = buildMockIo();
      const { socket, mockSocketTo, mockSocketEmit } = buildMockSocket();
      const mockAck: jest.Mock = jest.fn();
      const payload: CanvasImagePayload = {
        idRoom: "room-1",
        dataUrl: "data:image/png;base64,abc",
      };

      GameEvent.canvasImage({ io, socket, payload, ack: mockAck });

      expect(mockAck).toHaveBeenCalledWith(
        expect.objectContaining({
          ok: true,
          code: CODES_SUCCESS.canvasImageSent,
        })
      );
      expect(mockSocketTo).toHaveBeenCalledWith("room-1");
      expect(mockSocketEmit).toHaveBeenCalledWith(
        EVENTS_SOCKET_SERVER.CANVAS_IMAGE_GAME,
        "data:image/png;base64,abc"
      );
    });
  });

  describe("canvasClear", () => {
    it("should ack with ok and emit clear to room", () => {
      const { io } = buildMockIo();
      const { socket, mockSocketTo, mockSocketEmit } = buildMockSocket();
      const mockAck: jest.Mock = jest.fn();

      GameEvent.canvasClear({ io, socket, idRoom: "room-1", ack: mockAck });

      expect(mockAck).toHaveBeenCalledWith(
        expect.objectContaining({
          ok: true,
          code: CODES_SUCCESS.canvasCleared,
        })
      );
      expect(mockSocketTo).toHaveBeenCalledWith("room-1");
      expect(mockSocketEmit).toHaveBeenCalledWith(EVENTS_SOCKET_SERVER.CANVAS_CLEAR_GAME);
    });
  });

  describe("countdown", () => {
    it("should emit NEW_PAINTER when countdown is 0 and a player has not painted", async () => {
      const { io, mockTo, mockEmit } = buildMockIo();
      const { socket } = buildMockSocket();
      const mockAck: jest.Mock = jest.fn();
      const room: Room = buildRoom({
        configuration: {
          name: "Test Room",
          slots: 6,
          type: "public",
          password: "",
          rounds: { totalRounds: 3, actualRound: 1 },
          countdown: { countdownGame: 0, countdownSelected: 60 },
        },
        players: [
          buildPlayer({ id: "s1", isPainting: true, alreadyPainted: false }),
          buildPlayer({ id: "s2", isPainting: false, alreadyPainted: false }),
        ],
      });
      setupRedisState({ "room-1": room });

      await GameEvent.countdown({ io, socket, idRoom: "room-1", ack: mockAck });

      expect(mockAck).toHaveBeenCalledWith(
        expect.objectContaining({ ok: true, code: CODES_SUCCESS.countdownUpdated })
      );
      expect(mockTo).toHaveBeenCalledWith("room-1");
      expect(mockEmit).toHaveBeenCalledWith(EVENTS_SOCKET_SERVER.NEW_PAINTER_GAME);
    });

    it("should emit FINISH_GAME when countdown is 0 and next round exceeds total", async () => {
      const { io, mockEmit } = buildMockIo();
      const { socket } = buildMockSocket();
      const mockAck: jest.Mock = jest.fn();
      const room: Room = buildRoom({
        configuration: {
          name: "Test Room",
          slots: 6,
          type: "public",
          password: "",
          rounds: { totalRounds: 3, actualRound: 3 },
          countdown: { countdownGame: 0, countdownSelected: 60 },
        },
        players: [
          buildPlayer({ id: "s1", isPainting: true, alreadyPainted: true }),
          buildPlayer({ id: "s2", isPainting: false, alreadyPainted: true }),
        ],
      });
      setupRedisState({ "room-1": room });

      await GameEvent.countdown({ io, socket, idRoom: "room-1", ack: mockAck });

      expect(mockEmit).toHaveBeenCalledWith(EVENTS_SOCKET_SERVER.FINISH_GAME);
    });

    it("should emit NEXT_ROUND when countdown is 0 and next round is valid", async () => {
      const { io, mockEmit } = buildMockIo();
      const { socket } = buildMockSocket();
      const mockAck: jest.Mock = jest.fn();
      const room: Room = buildRoom({
        configuration: {
          name: "Test Room",
          slots: 6,
          type: "public",
          password: "",
          rounds: { totalRounds: 3, actualRound: 1 },
          countdown: { countdownGame: 0, countdownSelected: 60 },
        },
        players: [
          buildPlayer({ id: "s1", isPainting: true, alreadyPainted: true }),
          buildPlayer({ id: "s2", isPainting: false, alreadyPainted: true }),
        ],
      });
      setupRedisState({ "room-1": room });

      await GameEvent.countdown({ io, socket, idRoom: "room-1", ack: mockAck });

      expect(mockEmit).toHaveBeenCalledWith(EVENTS_SOCKET_SERVER.NEXT_ROUND_GAME);
    });

    it("should decrement countdown and update room", async () => {
      const { io, mockTo, mockEmit } = buildMockIo();
      const { socket } = buildMockSocket();
      const mockAck: jest.Mock = jest.fn();
      const room: Room = buildRoom();
      setupRedisState({ "room-1": room });

      await GameEvent.countdown({ io, socket, idRoom: "room-1", ack: mockAck });

      expect(mockAck).toHaveBeenCalledWith(
        expect.objectContaining({ ok: true, code: CODES_SUCCESS.countdownUpdated })
      );
      expect(mockedRedisService.setRooms).toHaveBeenCalled();
      expect(mockTo).toHaveBeenCalledWith("room-1");
      expect(mockEmit).toHaveBeenCalledWith(EVENTS_SOCKET_SERVER.UPDATE_GAME, expect.any(Object));
    });

    it("should ack with error when room does not exist", async () => {
      const { io } = buildMockIo();
      const { socket } = buildMockSocket();
      const mockAck: jest.Mock = jest.fn();
      setupRedisState({});

      await GameEvent.countdown({ io, socket, idRoom: "nonexistent", ack: mockAck });

      expect(mockAck).toHaveBeenCalledWith(
        expect.objectContaining({ ok: false, code: CODES_ERROR.generic })
      );
    });
  });

  describe("sendMessage", () => {
    it("should broadcast message when word is not guessed", async () => {
      setupUuidMock();
      const { io, mockEmit } = buildMockIo();
      const { socket } = buildMockSocket("socket-2");
      const mockAck: jest.Mock = jest.fn();
      const room: Room = buildRoom();
      const user: User = { id: "socket-2", username: "guesser", actualRoom: "room-1" };
      const payload: SendMessageGamePayload = { idRoom: "room-1", message: "wrong guess" };
      setupRedisState({ "room-1": room }, { "socket-2": user });

      await GameEvent.sendMessage({ io, socket, payload, ack: mockAck });

      expect(mockAck).toHaveBeenCalledWith(
        expect.objectContaining({
          ok: true,
          code: CODES_SUCCESS.gameMessageSent,
        })
      );
      expect(mockEmit).toHaveBeenCalledWith(
        EVENTS_SOCKET_SERVER.SEND_MESSAGE_GAME,
        expect.objectContaining({ message: "wrong guess" })
      );
    });

    it("should update score when word is guessed correctly", async () => {
      setupUuidMock();
      const { io, mockEmit } = buildMockIo();
      const { socket } = buildMockSocket("socket-2");
      const mockAck: jest.Mock = jest.fn();
      const room: Room = buildRoom();
      const user: User = { id: "socket-2", username: "guesser", actualRoom: "room-1" };
      const payload: SendMessageGamePayload = { idRoom: "room-1", message: "arbol" };
      setupRedisState({ "room-1": room }, { "socket-2": user });

      await GameEvent.sendMessage({ io, socket, payload, ack: mockAck });

      expect(mockAck).toHaveBeenCalledWith(expect.objectContaining({ ok: true }));
      expect(mockedRedisService.setRooms).toHaveBeenCalled();
      expect(mockEmit).toHaveBeenCalledWith(EVENTS_SOCKET_SERVER.UPDATE_GAME, expect.any(Object));
    });

    it("should ack with error when service throws", async () => {
      const { io } = buildMockIo();
      const { socket } = buildMockSocket();
      const mockAck: jest.Mock = jest.fn();
      const payload: SendMessageGamePayload = { idRoom: "room-1", message: "hi" };
      mockedRedisService.getRooms.mockRejectedValue(new Error("Redis down"));

      await GameEvent.sendMessage({ io, socket, payload, ack: mockAck });

      expect(mockAck).toHaveBeenCalledWith(expect.objectContaining({ ok: false }));
    });
  });

  describe("newPainter", () => {
    it("should set a new painter and ack with ok", async () => {
      const { io, mockTo } = buildMockIo();
      const { socket } = buildMockSocket();
      const mockAck: jest.Mock = jest.fn();
      const room: Room = buildRoom({
        players: [
          buildPlayer({ id: "s1", isPainting: true, alreadyPainted: false }),
          buildPlayer({ id: "s2", isPainting: false, alreadyPainted: false }),
        ],
      });
      setupRedisState({ "room-1": room });

      await GameEvent.newPainter({ io, socket, idRoom: "room-1", ack: mockAck });

      expect(mockAck).toHaveBeenCalledWith(
        expect.objectContaining({
          ok: true,
          code: CODES_SUCCESS.newPainterSet,
        })
      );
      expect(mockedRedisService.setRooms).toHaveBeenCalled();
      expect(mockTo).toHaveBeenCalledWith("room-1");
    });

    it("should ack with error when service throws", async () => {
      const { io } = buildMockIo();
      const { socket } = buildMockSocket();
      const mockAck: jest.Mock = jest.fn();
      mockedRedisService.getRooms.mockRejectedValue(new Error("Redis down"));

      await GameEvent.newPainter({ io, socket, idRoom: "room-1", ack: mockAck });

      expect(mockAck).toHaveBeenCalledWith(expect.objectContaining({ ok: false }));
    });
  });

  describe("nextRound", () => {
    it("should reset players and advance round", async () => {
      const { io, mockTo } = buildMockIo();
      const { socket } = buildMockSocket();
      const mockAck: jest.Mock = jest.fn();
      const room: Room = buildRoom({
        players: [
          buildPlayer({ id: "s1", isPainting: true, alreadyPainted: true }),
          buildPlayer({ id: "s2", isPainting: false, alreadyPainted: true }),
        ],
      });
      setupRedisState({ "room-1": room });

      await GameEvent.nextRound({ io, socket, idRoom: "room-1", ack: mockAck });

      expect(mockAck).toHaveBeenCalledWith(
        expect.objectContaining({
          ok: true,
          code: CODES_SUCCESS.nextRoundStarted,
        })
      );
      expect(mockedRedisService.setRooms).toHaveBeenCalled();
      expect(mockTo).toHaveBeenCalledWith("room-1");
    });

    it("should ack with error when service throws", async () => {
      const { io } = buildMockIo();
      const { socket } = buildMockSocket();
      const mockAck: jest.Mock = jest.fn();
      mockedRedisService.getRooms.mockRejectedValue(new Error("Redis down"));

      await GameEvent.nextRound({ io, socket, idRoom: "room-1", ack: mockAck });

      expect(mockAck).toHaveBeenCalledWith(expect.objectContaining({ ok: false }));
    });
  });

  describe("finish", () => {
    it("should ack with ok when room exists", async () => {
      const { io } = buildMockIo();
      const { socket } = buildMockSocket();
      const mockAck: jest.Mock = jest.fn();
      const room: Room = buildRoom();
      setupRedisState({ "room-1": room });

      await GameEvent.finish({ io, socket, idRoom: "room-1", ack: mockAck });

      expect(mockAck).toHaveBeenCalledWith({
        ok: true,
        code: CODES_SUCCESS.gameFinished,
        message: MESSAGES_SUCCESS.gameFinished,
        data: null,
      });
    });

    it("should ack with error when room does not exist", async () => {
      const { io } = buildMockIo();
      const { socket } = buildMockSocket();
      const mockAck: jest.Mock = jest.fn();
      setupRedisState({});

      await GameEvent.finish({ io, socket, idRoom: "nonexistent", ack: mockAck });

      expect(mockAck).toHaveBeenCalledWith(
        expect.objectContaining({ ok: false, code: CODES_ERROR.generic })
      );
    });

    it("should ack with error when service throws", async () => {
      const { io } = buildMockIo();
      const { socket } = buildMockSocket();
      const mockAck: jest.Mock = jest.fn();
      mockedRedisService.getRooms.mockRejectedValue(new Error("Redis down"));

      await GameEvent.finish({ io, socket, idRoom: "room-1", ack: mockAck });

      expect(mockAck).toHaveBeenCalledWith(expect.objectContaining({ ok: false }));
    });
  });
});
