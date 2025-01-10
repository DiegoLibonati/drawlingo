import { CustomSocket, Room, Rooms } from "@src/entities/entities";
import { EVENTS_SOCKET_SERVER } from "@src/entities/enums";

import { getRedis, setRedis } from "@src/redisClient";
import { generateWordPlaceholder } from "@src/helpers/generateWordPlaceholder";

interface WordSelectedGameEventProps extends CustomSocket {
  idRoom: string;
  wordSelected: string;
}

export const wordSelectedGameEvent = async ({
  io,
  idRoom,
  wordSelected,
}: WordSelectedGameEventProps) => {
  const rooms = await getRedis<Rooms>("rooms");
  const room = rooms[idRoom];

  if (!room) {
    return;
  }

  const roomPlayersUpdated = room.players.map((player) => {
    if (player.choosingAWord) {
      player.choosingAWord = false;
      player.guessed = false;
      player.isPaiting = true;
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

  setRedis<Rooms>("rooms", roomsUpdated);

  return io.to(room.id).emit(EVENTS_SOCKET_SERVER.UPDATE_GAME, roomUpdated);
};
