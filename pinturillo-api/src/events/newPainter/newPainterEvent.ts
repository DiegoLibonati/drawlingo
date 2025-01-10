import { CustomSocket, Room, Rooms } from "@src/entities/entities";
import { EVENTS_SOCKET_SERVER } from "@src/entities/enums";

import { getRedis, setRedis } from "@src/redisClient";
import { getFourRandomWords } from "@src/helpers/getFourRandomWords";
import { WORDS } from "@src/constants/constants";

interface NewPainterEventProps extends CustomSocket {
  idRoom: string;
}

export const newPainterEvent = async ({ io, idRoom }: NewPainterEventProps) => {
  const rooms = await getRedis<Rooms>("rooms");
  const room = rooms[idRoom];

  const playerNotPaintedYet = room.players.find(
    (player) => !player.isPaiting && !player.alreadyPainted
  );

  const playersWithNewPainter = room.players.map((player) => {
    if (player.isPaiting) {
      player.alreadyPainted = true;
    }

    player.isPaiting = false;
    player.guessed = false;

    if (playerNotPaintedYet?.id === player.id) {
      player.choosingAWord = true;
      player.isPaiting = true;
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

  setRedis<Rooms>("rooms", roomsUpdated);

  console.log("GAME NUEVO PINTOR");
  return io.to(room.id).emit(EVENTS_SOCKET_SERVER.UPDATE_GAME, roomNewPainter);
};
