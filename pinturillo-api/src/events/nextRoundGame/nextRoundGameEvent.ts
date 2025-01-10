import { CustomSocket, Room, Rooms } from "@src/entities/entities";
import { EVENTS_SOCKET_SERVER } from "@src/entities/enums";

import { getRedis, setRedis } from "@src/redisClient";
import { getFourRandomWords } from "@src/helpers/getFourRandomWords";
import { WORDS } from "@src/constants/constants";

interface NextRoundGameEventProps extends CustomSocket {
  idRoom: string;
}

export const nextRoundGameEvent = async ({
  io,
  idRoom,
}: NextRoundGameEventProps) => {
  const rooms = await getRedis<Rooms>("rooms");
  const room = rooms[idRoom];

  const playersReset = room.players.map((player) => {
    player.alreadyPainted = false;
    player.isPaiting = false;
    player.choosingAWord = false;
    player.guessed = false;
    return player;
  });

  playersReset[0].choosingAWord = true;
  playersReset[0].isPaiting = true;

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

  setRedis<Rooms>("rooms", roomsUpdated);

  console.log("GAME ACTUALIZACION DE ROUNDS", room.configuration.rounds);

  return io.to(room.id).emit(EVENTS_SOCKET_SERVER.UPDATE_GAME, roomResetRound);
};
