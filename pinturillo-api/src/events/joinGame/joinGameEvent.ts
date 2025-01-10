import { CustomSocket, Lobby, Rooms } from "@src/entities/entities";
import { EVENTS_SOCKET_SERVER } from "@src/entities/enums";

import { getRedis, setRedis } from "@src/redisClient";
import { getFourRandomWords } from "@src/helpers/getFourRandomWords";
import { getRoomsAvailables } from "@src/helpers/getRoomsAvailables";
import { idLobby, WORDS } from "@src/constants/constants";

interface JoinGameEventProps extends CustomSocket {
  idRoom: string;
}

export const JoinGameEvent = async ({ io, idRoom }: JoinGameEventProps) => {
  const lobby = await getRedis<Lobby>("lobby");
  const rooms = await getRedis<Rooms>("rooms");
  const room = rooms[idRoom];

  const playerToPaint = room.players[0];

  room.started = true;
  room.wordToGuess.wordsToChoose = await getFourRandomWords(WORDS);

  playerToPaint.choosingAWord = true;
  playerToPaint.isPaiting = true;

  const roomsUpdated: Rooms = {
    ...rooms,
    [room.id]: room,
  };

  const lobbyUpdated: Lobby = {
    ...lobby,
    rooms: getRoomsAvailables(roomsUpdated),
  };

  setRedis<Rooms>("rooms", roomsUpdated);
  setRedis<Lobby>("lobby", lobbyUpdated);

  io.to(idLobby).emit(EVENTS_SOCKET_SERVER.UPDATE_LOBBY, lobbyUpdated);
  return io.to(room.id).emit(EVENTS_SOCKET_SERVER.UPDATE_GAME, room);
};
