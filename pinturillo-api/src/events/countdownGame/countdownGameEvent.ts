import { CustomSocket, Room, Rooms } from "@src/entities/entities";
import { EVENTS_SOCKET_SERVER } from "@src/entities/enums";

import { getRedis, setRedis } from "@src/redisClient";
import { revealLetter } from "@src/helpers/revealLetter";

interface CountdownGameEventProps extends CustomSocket {
  idRoom: string;
}

export const countdownGameEvent = async ({
  io,
  idRoom,
}: CountdownGameEventProps) => {
  const rooms = await getRedis<Rooms>("rooms");
  const room = rooms[idRoom];

  if (!room) {
    return;
  }

  const countdown = room.configuration.countdown.countdownGame;
  const playerNotPaintedYet = room.players.find(
    (player) => !player.isPaiting && !player.alreadyPainted
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

  setRedis<Rooms>("rooms", roomsUpdated);

  return io.to(idRoom).emit(EVENTS_SOCKET_SERVER.UPDATE_GAME, roomUpdated);
};
