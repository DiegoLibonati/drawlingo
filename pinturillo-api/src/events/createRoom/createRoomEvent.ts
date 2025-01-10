import { v4 as uuidv4 } from "uuid";

import {
  CustomSocket,
  Lobby,
  OptionsRoom,
  Room,
  Rooms,
  Users,
} from "@src/entities/entities";
import { EVENTS_SOCKET_SERVER } from "@src/entities/enums";

import { getRedis, setRedis } from "@src/redisClient";
import { getRoomsAvailables } from "@src/helpers/getRoomsAvailables";
import { idLobby } from "@src/constants/constants";

interface CreateRoomEventProps extends CustomSocket {
  optionsRoom: OptionsRoom;
}

export const createRoomEvent = async ({
  io,
  socket,
  optionsRoom,
}: CreateRoomEventProps) => {
  const idRoom = uuidv4();
  await socket.join(idRoom);

  const users = await getRedis<Users>("users");
  const rooms = await getRedis<Rooms>("rooms");
  const lobby = await getRedis<Lobby>("lobby");

  const socketUser = users[socket.id];
  socketUser.actualRoom = idRoom;

  const { name, password, slots, totalRounds, type, countdown } = optionsRoom;

  const newRoom: Room = {
    id: idRoom,
    configuration: {
      name: name,
      slots: slots,
      type: type,
      password: password,
      rounds: {
        totalRounds: totalRounds,
        actualRound: 1,
      },
      countdown: {
        countdownGame: countdown,
        countdownSelected: countdown,
      },
    },
    players: [
      {
        ...socketUser,
        score: 0,
        isPaiting: false,
        choosingAWord: false,
        alreadyPainted: false,
        guessed: false,
      },
    ],
    started: false,
    owner: socketUser,
    wordToGuess: {
      actualWord: "",
      wordsToChoose: [],
      wordWithPlaceholder: "",
    },
  };

  const usersUpdated: Users = {
    ...users,
    [socketUser.id]: socketUser,
  };

  const roomsUpdated: Rooms = {
    ...rooms,
    [idRoom]: newRoom,
  };

  const lobbyUpdated: Lobby = {
    ...lobby,
    rooms: getRoomsAvailables(roomsUpdated),
  };

  setRedis<Users>("users", usersUpdated);
  setRedis<Rooms>("rooms", roomsUpdated);
  setRedis<Lobby>("lobby", lobbyUpdated);

  socket.emit(EVENTS_SOCKET_SERVER.CREATE_ROOM, idRoom);
  return io.to(idLobby).emit(EVENTS_SOCKET_SERVER.UPDATE_LOBBY, lobbyUpdated);
};
