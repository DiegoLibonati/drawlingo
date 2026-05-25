import { v4 as uuidv4 } from "uuid";

import type {
  CanvasClearGameEventProps,
  CanvasImageGameEventProps,
  CountdownGameEventProps,
  FinishGameEventProps,
  JoinGameEventProps,
  NewPainterGameEventProps,
  NextRoundGameEventProps,
  SendMessageGameEventProps,
  StartGameEventsProps,
  WordSelectedGameEventProps,
} from "@/types/props";
import type { Lobby, Message, Room, Rooms, Users } from "@/types/app";

import { EVENTS_SOCKET_SERVER } from "@/constants/events.constant";
import { CODES_SUCCESS, CODES_ERROR } from "@/constants/codes.constant";
import { MESSAGES_SUCCESS, MESSAGES_ERROR } from "@/constants/messages.constant";
import { idLobby, WORDS } from "@/constants/vars.constant";

import { RedisService } from "@/services/redis.service";

import { getExceptionMessage } from "@/helpers/get_exception_message.helper";
import { getFourRandomWords } from "@/helpers/get_four_random_words.helper";
import { getRoomsAvailables } from "@/helpers/get_rooms_availables.helper";
import { generateWordPlaceholder } from "@/helpers/generate_word_placeholder.helper";
import { revealLetter } from "@/helpers/reveal_letter.helper";

export const GameEvent = {
  start: ({ io, idRoom, ack }: StartGameEventsProps): void => {
    try {
      ack({
        ok: true,
        code: CODES_SUCCESS.gameStarted,
        message: MESSAGES_SUCCESS.gameStarted,
        data: null,
      });
      io.to(idRoom).emit(EVENTS_SOCKET_SERVER.START_GAME);
    } catch (e) {
      const { code, message } = getExceptionMessage(e);
      ack({ ok: false, code, message });
    }
  },

  join: async ({ io, idRoom, ack }: JoinGameEventProps): Promise<void> => {
    try {
      const lobby: Lobby = JSON.parse((await RedisService.getLobby()) ?? "{}") as Lobby;
      const rooms: Rooms = JSON.parse((await RedisService.getRooms()) ?? "{}") as Rooms;
      const room = rooms[idRoom]!;

      const playerToPaint = room.players[0]!;

      room.started = true;
      room.wordToGuess.wordsToChoose = getFourRandomWords(WORDS);

      playerToPaint.choosingAWord = true;
      playerToPaint.isPainting = true;

      const roomsUpdated: Rooms = { ...rooms, [room.id]: room };
      const lobbyUpdated: Lobby = { ...lobby, rooms: getRoomsAvailables(roomsUpdated) };

      await RedisService.setRooms(roomsUpdated);
      await RedisService.setLobby(lobbyUpdated);

      ack({
        ok: true,
        code: CODES_SUCCESS.gameJoined,
        message: MESSAGES_SUCCESS.gameJoined,
        data: room,
      });
      io.to(idLobby).emit(EVENTS_SOCKET_SERVER.UPDATE_LOBBY, lobbyUpdated);
      io.to(room.id).emit(EVENTS_SOCKET_SERVER.UPDATE_GAME, room);
    } catch (e) {
      const { code, message } = getExceptionMessage(e);
      ack({ ok: false, code, message });
    }
  },

  wordSelected: async ({ io, payload, ack }: WordSelectedGameEventProps): Promise<void> => {
    try {
      const { idRoom, wordSelected } = payload;
      const rooms: Rooms = JSON.parse((await RedisService.getRooms()) ?? "{}") as Rooms;
      const room = rooms[idRoom];

      if (!room) {
        ack({ ok: false, code: CODES_ERROR.generic, message: MESSAGES_ERROR.generic });
        return;
      }

      const roomPlayersUpdated = room.players.map((player) => {
        if (player.choosingAWord) {
          player.choosingAWord = false;
          player.guessed = false;
          player.isPainting = true;
        }
        return player;
      });

      const wordPlaceholder = generateWordPlaceholder(wordSelected);

      const roomUpdated: Room = {
        ...room,
        players: roomPlayersUpdated,
        wordToGuess: {
          actualWord: wordSelected,
          wordsToChoose: [],
          wordWithPlaceholder: wordPlaceholder.split("").join(" "),
        },
      };

      const roomsUpdated: Rooms = { ...rooms, [room.id]: roomUpdated };

      await RedisService.setRooms(roomsUpdated);

      ack({
        ok: true,
        code: CODES_SUCCESS.wordSelected,
        message: MESSAGES_SUCCESS.wordSelected,
        data: roomUpdated,
      });
      io.to(room.id).emit(EVENTS_SOCKET_SERVER.UPDATE_GAME, roomUpdated);
    } catch (e) {
      const { code, message } = getExceptionMessage(e);
      ack({ ok: false, code, message });
    }
  },

  canvasImage: ({ socket, payload, ack }: CanvasImageGameEventProps): void => {
    try {
      const { idRoom, dataUrl } = payload;
      ack({
        ok: true,
        code: CODES_SUCCESS.canvasImageSent,
        message: MESSAGES_SUCCESS.canvasImageSent,
        data: null,
      });
      socket.to(idRoom).emit(EVENTS_SOCKET_SERVER.CANVAS_IMAGE_GAME, dataUrl);
    } catch (e) {
      const { code, message } = getExceptionMessage(e);
      ack({ ok: false, code, message });
    }
  },

  canvasClear: ({ socket, idRoom, ack }: CanvasClearGameEventProps): void => {
    try {
      ack({
        ok: true,
        code: CODES_SUCCESS.canvasCleared,
        message: MESSAGES_SUCCESS.canvasCleared,
        data: null,
      });
      socket.to(idRoom).emit(EVENTS_SOCKET_SERVER.CANVAS_CLEAR_GAME);
    } catch (e) {
      const { code, message } = getExceptionMessage(e);
      ack({ ok: false, code, message });
    }
  },

  countdown: async ({ io, idRoom, ack }: CountdownGameEventProps): Promise<void> => {
    try {
      const rooms: Rooms = JSON.parse((await RedisService.getRooms()) ?? "{}") as Rooms;
      const room = rooms[idRoom];

      if (!room) {
        ack({ ok: false, code: CODES_ERROR.generic, message: MESSAGES_ERROR.generic });
        return;
      }

      const countdown = room.configuration.countdown.countdownGame;
      const playerNotPaintedYet = room.players.find(
        (player) => !player.isPainting && !player.alreadyPainted
      );

      if (playerNotPaintedYet && countdown === 0) {
        ack({
          ok: true,
          code: CODES_SUCCESS.countdownUpdated,
          message: MESSAGES_SUCCESS.countdownUpdated,
          data: null,
        });
        io.to(room.id).emit(EVENTS_SOCKET_SERVER.NEW_PAINTER_GAME);
        return;
      }

      const nextRound = room.configuration.rounds.actualRound + 1;

      if (countdown === 0 && nextRound > room.configuration.rounds.totalRounds) {
        ack({
          ok: true,
          code: CODES_SUCCESS.countdownUpdated,
          message: MESSAGES_SUCCESS.countdownUpdated,
          data: null,
        });
        io.to(room.id).emit(EVENTS_SOCKET_SERVER.FINISH_GAME);
        return;
      }

      if (countdown === 0 && nextRound <= room.configuration.rounds.totalRounds) {
        ack({
          ok: true,
          code: CODES_SUCCESS.countdownUpdated,
          message: MESSAGES_SUCCESS.countdownUpdated,
          data: null,
        });
        io.to(room.id).emit(EVENTS_SOCKET_SERVER.NEXT_ROUND_GAME);
        return;
      }

      let roomUpdated: Room = {
        ...room,
        configuration: {
          ...room.configuration,
          countdown: {
            countdownGame: countdown - 1,
            countdownSelected: room.configuration.countdown.countdownSelected,
          },
        },
      };

      const listenCountdown = [15, 30, 45, 60, 75];

      if (listenCountdown.includes(countdown)) {
        const newWordPlaceholder = revealLetter(
          room.wordToGuess.actualWord,
          room.wordToGuess.wordWithPlaceholder
        );

        roomUpdated = {
          ...roomUpdated,
          wordToGuess: { ...roomUpdated.wordToGuess, wordWithPlaceholder: newWordPlaceholder },
        };
      }

      const roomsUpdated: Rooms = { ...rooms, [room.id]: roomUpdated };

      await RedisService.setRooms(roomsUpdated);

      ack({
        ok: true,
        code: CODES_SUCCESS.countdownUpdated,
        message: MESSAGES_SUCCESS.countdownUpdated,
        data: null,
      });
      io.to(idRoom).emit(EVENTS_SOCKET_SERVER.UPDATE_GAME, roomUpdated);
    } catch (e) {
      const { code, message } = getExceptionMessage(e);
      ack({ ok: false, code, message });
    }
  },

  sendMessage: async ({ io, socket, payload, ack }: SendMessageGameEventProps): Promise<void> => {
    try {
      const { idRoom, message } = payload;
      const rooms: Rooms = JSON.parse((await RedisService.getRooms()) ?? "{}") as Rooms;
      const users: Users = JSON.parse((await RedisService.getUsers()) ?? "{}") as Users;

      const user = users[socket.id]!;
      const room = rooms[idRoom]!;

      const wordToGuess = room.wordToGuess.actualWord.toLocaleLowerCase();
      const userMessage = message.toLocaleLowerCase();

      const newMessage: Message = { id: uuidv4(), user, message };

      const countdown = room.configuration.countdown.countdownGame;

      if (
        countdown === 0 ||
        room.wordToGuess.wordsToChoose.length > 0 ||
        wordToGuess !== userMessage
      ) {
        ack({
          ok: true,
          code: CODES_SUCCESS.gameMessageSent,
          message: MESSAGES_SUCCESS.gameMessageSent,
          data: newMessage,
        });
        io.to(room.id).emit(EVENTS_SOCKET_SERVER.SEND_MESSAGE_GAME, newMessage);
        return;
      }

      const playersGuessUpdated = room.players.map((player) => {
        if (player.id === user.id && !player.guessed && !player.isPainting) {
          player.guessed = true;
          player.score += Math.ceil((wordToGuess.length * countdown) / 1.2);
          newMessage.success = true;
        }
        return player;
      });

      const missingSomeoneGuess =
        playersGuessUpdated.find((player) => !player.guessed && !player.isPainting) ?? null;

      let roomUpdated: Room = { ...room, players: playersGuessUpdated };

      if (!missingSomeoneGuess) {
        roomUpdated = {
          ...roomUpdated,
          configuration: {
            ...roomUpdated.configuration,
            countdown: {
              countdownGame: 0,
              countdownSelected: roomUpdated.configuration.countdown.countdownSelected,
            },
          },
        };
      }

      const roomsUpdated: Rooms = { ...rooms, [room.id]: roomUpdated };

      await RedisService.setRooms(roomsUpdated);

      ack({
        ok: true,
        code: CODES_SUCCESS.gameMessageSent,
        message: MESSAGES_SUCCESS.gameMessageSent,
        data: newMessage,
      });
      io.to(room.id).emit(EVENTS_SOCKET_SERVER.UPDATE_GAME, roomUpdated);
      io.to(room.id).emit(EVENTS_SOCKET_SERVER.SEND_MESSAGE_GAME, newMessage);
    } catch (e) {
      const { code, message } = getExceptionMessage(e);
      ack({ ok: false, code, message });
    }
  },

  newPainter: async ({ io, idRoom, ack }: NewPainterGameEventProps): Promise<void> => {
    try {
      const rooms: Rooms = JSON.parse((await RedisService.getRooms()) ?? "{}") as Rooms;
      const room = rooms[idRoom]!;

      const playerNotPaintedYet = room.players.find(
        (player) => !player.isPainting && !player.alreadyPainted
      );

      const playersWithNewPainter = room.players.map((player) => {
        if (player.isPainting) player.alreadyPainted = true;
        player.isPainting = false;
        player.guessed = false;

        if (playerNotPaintedYet?.id === player.id) {
          player.choosingAWord = true;
          player.isPainting = true;
        }

        return player;
      });

      const roomNewPainter: Room = {
        ...room,
        players: playersWithNewPainter,
        configuration: {
          ...room.configuration,
          countdown: {
            countdownGame: room.configuration.countdown.countdownSelected,
            countdownSelected: room.configuration.countdown.countdownSelected,
          },
        },
        wordToGuess: {
          actualWord: "",
          wordsToChoose: getFourRandomWords(WORDS),
          wordWithPlaceholder: "",
        },
      };

      const roomsUpdated: Rooms = { ...rooms, [room.id]: roomNewPainter };

      await RedisService.setRooms(roomsUpdated);

      ack({
        ok: true,
        code: CODES_SUCCESS.newPainterSet,
        message: MESSAGES_SUCCESS.newPainterSet,
        data: roomNewPainter,
      });
      io.to(room.id).emit(EVENTS_SOCKET_SERVER.UPDATE_GAME, roomNewPainter);
    } catch (e) {
      const { code, message } = getExceptionMessage(e);
      ack({ ok: false, code, message });
    }
  },

  nextRound: async ({ io, idRoom, ack }: NextRoundGameEventProps): Promise<void> => {
    try {
      const rooms: Rooms = JSON.parse((await RedisService.getRooms()) ?? "{}") as Rooms;
      const room = rooms[idRoom]!;

      const playersReset = room.players.map((player) => {
        player.alreadyPainted = false;
        player.isPainting = false;
        player.choosingAWord = false;
        player.guessed = false;
        return player;
      });

      playersReset[0]!.choosingAWord = true;
      playersReset[0]!.isPainting = true;

      const nextRound = room.configuration.rounds.actualRound + 1;

      const roomResetRound: Room = {
        ...room,
        configuration: {
          ...room.configuration,
          rounds: { ...room.configuration.rounds, actualRound: nextRound },
          countdown: {
            countdownGame: room.configuration.countdown.countdownSelected,
            countdownSelected: room.configuration.countdown.countdownSelected,
          },
        },
        players: playersReset,
        wordToGuess: {
          actualWord: "",
          wordsToChoose: getFourRandomWords(WORDS),
          wordWithPlaceholder: "",
        },
      };

      const roomsUpdated: Rooms = { ...rooms, [room.id]: roomResetRound };

      await RedisService.setRooms(roomsUpdated);

      ack({
        ok: true,
        code: CODES_SUCCESS.nextRoundStarted,
        message: MESSAGES_SUCCESS.nextRoundStarted,
        data: roomResetRound,
      });
      io.to(room.id).emit(EVENTS_SOCKET_SERVER.UPDATE_GAME, roomResetRound);
    } catch (e) {
      const { code, message } = getExceptionMessage(e);
      ack({ ok: false, code, message });
    }
  },

  finish: async ({ idRoom, ack }: FinishGameEventProps): Promise<void> => {
    try {
      const rooms: Rooms = JSON.parse((await RedisService.getRooms()) ?? "{}") as Rooms;
      const room = rooms[idRoom];

      if (!room) {
        ack({ ok: false, code: CODES_ERROR.generic, message: MESSAGES_ERROR.generic });
        return;
      }

      ack({
        ok: true,
        code: CODES_SUCCESS.gameFinished,
        message: MESSAGES_SUCCESS.gameFinished,
        data: null,
      });
    } catch (e) {
      const { code, message } = getExceptionMessage(e);
      ack({ ok: false, code, message });
    }
  },
};
