import { v4 as uuidv4 } from "uuid";

import { EVENTS_SOCKET_SERVER } from "@src/entities/enums";
import {
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
} from "@src/entities/props";
import { Lobby, Message, Room, Rooms } from "@src/entities/app";

import { RedisService } from "@src/services/redis.service";

import { getFourRandomWords } from "@src/helpers/get_four_random_words.helper";
import { getRoomsAvailables } from "@src/helpers/get_rooms_availables.helper";
import { generateWordPlaceholder } from "@src/helpers/generate_word_placeholder.helper";
import { revealLetter } from "@src/helpers/reveal_letter.helper";

import { idLobby, WORDS } from "@src/constants/vars";

export const GameEvent = {
  start: ({ io, idRoom }: StartGameEventsProps) => {
    return io.to(idRoom).emit(EVENTS_SOCKET_SERVER.START_GAME);
  },
  join: async ({ io, idRoom }: JoinGameEventProps) => {
    const lobby = await RedisService.getLobby();
    const rooms = await RedisService.getRooms();
    const room = rooms[idRoom];

    const playerToPaint = room.players[0];

    room.started = true;
    room.wordToGuess.wordsToChoose = await getFourRandomWords(WORDS);

    playerToPaint.choosingAWord = true;
    playerToPaint.isPainting = true;

    const roomsUpdated: Rooms = {
      ...rooms,
      [room.id]: room,
    };

    const lobbyUpdated: Lobby = {
      ...lobby,
      rooms: getRoomsAvailables(roomsUpdated),
    };

    RedisService.setRooms(roomsUpdated);
    RedisService.setLobby(lobbyUpdated);

    io.to(idLobby).emit(EVENTS_SOCKET_SERVER.UPDATE_LOBBY, lobbyUpdated);
    return io.to(room.id).emit(EVENTS_SOCKET_SERVER.UPDATE_GAME, room);
  },
  wordSelected: async ({
    io,
    idRoom,
    wordSelected,
  }: WordSelectedGameEventProps) => {
    const rooms = await RedisService.getRooms();
    const room = rooms[idRoom];

    if (!room) {
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

    const roomsUpdated: Rooms = {
      ...rooms,
      [room.id]: roomUpdated,
    };

    RedisService.setRooms(roomsUpdated);

    return io.to(room.id).emit(EVENTS_SOCKET_SERVER.UPDATE_GAME, roomUpdated);
  },
  canvasImage: ({ socket, idRoom, dataUrl }: CanvasImageGameEventProps) => {
    return socket
      .to(idRoom)
      .emit(EVENTS_SOCKET_SERVER.CANVAS_IMAGE_GAME, dataUrl);
  },
  canvasClear: ({ socket, idRoom }: CanvasClearGameEventProps) => {
    return socket.to(idRoom).emit(EVENTS_SOCKET_SERVER.CANVAS_CLEAR_GAME);
  },
  countdown: async ({ io, idRoom }: CountdownGameEventProps) => {
    const rooms = await RedisService.getRooms();
    const room = rooms[idRoom];

    if (!room) {
      return;
    }

    const countdown = room.configuration.countdown.countdownGame;
    const playerNotPaintedYet = room.players.find(
      (player) => !player.isPainting && !player.alreadyPainted
    );

    // NOTE: Si todavia un player no pinto y el coundown llego a 0
    if (playerNotPaintedYet && countdown === 0) {
      return io.to(room.id).emit(EVENTS_SOCKET_SERVER.NEW_PAINTER_GAME);
    }

    const nextRound = room.configuration.rounds.actualRound + 1;

    // NOTE: Si el proximo round es mayor al total de rounds y el coundown llego a 0
    if (countdown === 0 && nextRound > room.configuration.rounds.totalRounds) {
      return io.to(room.id).emit(EVENTS_SOCKET_SERVER.FINISH_GAME);
    }

    // NOTE: Si el proximo round es menor igual al total de rounds y el coundown llego a 0
    if (countdown === 0 && nextRound <= room.configuration.rounds.totalRounds) {
      return io.to(room.id).emit(EVENTS_SOCKET_SERVER.NEXT_ROUND_GAME);
    }

    // NOTE: Si el coundown sigue corriendo y no llego a 0
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
      const newWordPlaceholder = await revealLetter(
        room.wordToGuess.actualWord,
        room.wordToGuess.wordWithPlaceholder
      );

      roomUpdated = {
        ...roomUpdated,
        wordToGuess: {
          ...roomUpdated.wordToGuess,
          wordWithPlaceholder: newWordPlaceholder,
        },
      };
    }

    const roomsUpdated: Rooms = {
      ...rooms,
      [room.id]: roomUpdated,
    };

    RedisService.setRooms(roomsUpdated);

    return io.to(idRoom).emit(EVENTS_SOCKET_SERVER.UPDATE_GAME, roomUpdated);
  },
  sendMessage: async ({
    io,
    socket,
    idRoom,
    message,
  }: SendMessageGameEventProps) => {
    const rooms = await RedisService.getRooms();
    const users = await RedisService.getUsers();

    const user = users[socket.id];
    const room = rooms[idRoom];

    const wordToGuess = room.wordToGuess.actualWord.toLocaleLowerCase();
    const userMessage = message.toLocaleLowerCase();

    const newMessage: Message = {
      id: uuidv4(),
      user: user,
      message: message,
    };

    const countdown = room.configuration.countdown.countdownGame;

    // NOTE: Si se tira una palabra y el contador llega a 0 o se esta eligiendo una palabra o si se tira una palabra que no es la que hay que adivinar
    if (
      countdown === 0 ||
      room.wordToGuess.wordsToChoose.length > 0 ||
      wordToGuess !== userMessage
    ) {
      return io
        .to(room.id)
        .emit(EVENTS_SOCKET_SERVER.SEND_MESSAGE_GAME, newMessage);
    }

    // NOTE: Se adivino la palabra
    // NOTE: Usuario adivina - Queda gente por adivinar
    const playersGuessUpdated = room.players.map((player) => {
      if (player.id === user.id && !player.guessed && !player.isPainting) {
        player.guessed = true;
        player.score += Math.ceil((wordToGuess.length * countdown) / 1.2);
        newMessage.success = true;
      }

      return player;
    });

    const missingSomeoneGuess =
      playersGuessUpdated.find(
        (player) => !player.guessed && !player.isPainting
      ) || null;

    let roomUpdated: Room = {
      ...room,
      players: playersGuessUpdated,
    };

    // TODO: Todos adivinaron - Nadie queda por adivinar
    if (!missingSomeoneGuess) {
      roomUpdated = {
        ...roomUpdated,
        configuration: {
          ...roomUpdated.configuration,
          countdown: {
            countdownGame: 0,
            countdownSelected:
              roomUpdated.configuration.countdown.countdownSelected,
          },
        },
      };
    }

    const roomsUpdated: Rooms = {
      ...rooms,
      [room.id]: roomUpdated,
    };

    RedisService.setRooms(roomsUpdated);

    io.to(room.id).emit(EVENTS_SOCKET_SERVER.UPDATE_GAME, roomUpdated);

    return io
      .to(room.id)
      .emit(EVENTS_SOCKET_SERVER.SEND_MESSAGE_GAME, newMessage);
  },
  newPainter: async ({ io, idRoom }: NewPainterGameEventProps) => {
    const rooms = await RedisService.getRooms();
    const room = rooms[idRoom];

    const playerNotPaintedYet = room.players.find(
      (player) => !player.isPainting && !player.alreadyPainted
    );

    const playersWithNewPainter = room.players.map((player) => {
      if (player.isPainting) {
        player.alreadyPainted = true;
      }

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
        wordsToChoose: await getFourRandomWords(WORDS),
        wordWithPlaceholder: "",
      },
    };

    const roomsUpdated: Rooms = {
      ...rooms,
      [room.id]: roomNewPainter,
    };

    RedisService.setRooms(roomsUpdated);

    console.log("GAME NUEVO PINTOR");
    return io
      .to(room.id)
      .emit(EVENTS_SOCKET_SERVER.UPDATE_GAME, roomNewPainter);
  },
  nextRound: async ({ io, idRoom }: NextRoundGameEventProps) => {
    const rooms = await RedisService.getRooms();
    const room = rooms[idRoom];

    const playersReset = room.players.map((player) => {
      player.alreadyPainted = false;
      player.isPainting = false;
      player.choosingAWord = false;
      player.guessed = false;
      return player;
    });

    playersReset[0].choosingAWord = true;
    playersReset[0].isPainting = true;

    const nextRound = room.configuration.rounds.actualRound + 1;

    const roomResetRound: Room = {
      ...room,
      configuration: {
        ...room.configuration,
        rounds: {
          ...room.configuration.rounds,
          actualRound: nextRound,
        },
        countdown: {
          countdownGame: room.configuration.countdown.countdownSelected,
          countdownSelected: room.configuration.countdown.countdownSelected,
        },
      },
      players: playersReset,
      wordToGuess: {
        actualWord: "",
        wordsToChoose: await getFourRandomWords(WORDS),
        wordWithPlaceholder: "",
      },
    };

    const roomsUpdated: Rooms = {
      ...rooms,
      [room.id]: roomResetRound,
    };

    RedisService.setRooms(roomsUpdated);

    console.log("GAME ACTUALIZACION DE ROUNDS", room.configuration.rounds);

    return io
      .to(room.id)
      .emit(EVENTS_SOCKET_SERVER.UPDATE_GAME, roomResetRound);
  },
  finish: async ({ idRoom }: FinishGameEventProps) => {
    const rooms = await RedisService.getRooms();
    const room = rooms[idRoom];

    console.log("GAME TERMINADO", room.id);
    return;
  },
};
