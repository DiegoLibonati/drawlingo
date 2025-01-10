import { CustomSocket, Lobby, Rooms, Users } from "@src/entities/entities";
import { EVENTS_SOCKET_SERVER } from "@src/entities/enums";

import { getRedis, setRedis } from "@src/redisClient";
import { getRoomsAvailables } from "@src/helpers/getRoomsAvailables";
import { idLobby } from "@src/constants/constants";

interface JoinLobbyRoomEventProps extends CustomSocket {
  idRoom: string;
}

export const joinRoomLobbyEvent = async ({
  io,
  socket,
  idRoom,
}: JoinLobbyRoomEventProps) => {
  const users = await getRedis<Users>("users");
  const rooms = await getRedis<Rooms>("rooms");
  const lobby = await getRedis<Lobby>("lobby");

  const socketUser = users[socket.id];
  const room = rooms[idRoom];

  if (!room) {
    return;
  }

  if (socketUser.id === room.owner.id) {
    return socket.emit(EVENTS_SOCKET_SERVER.UPDATE_ROOM_LOBBY, room);
  }

  // NOTE: Si ingresa un usuario a la sala que no es el dueño

  // Note: si ingresa alguien desde el lobby
  const usersLobbyUpdated =
    socketUser.actualRoom === idLobby
      ? lobby.users.filter((user) => user.id !== socketUser.id)
      : lobby.users;

  await socket.join(room.id);
  socketUser.actualRoom = room.id;

  room.players = [
    ...room.players,
    {
      ...socketUser,
      score: 0,
      isPaiting: false,
      choosingAWord: false,
      alreadyPainted: false,
      guessed: false,
    },
  ];

  const usersUpdated: Users = {
    ...users,
    [socketUser.id]: socketUser,
  };

  const roomsUpdated: Rooms = {
    ...rooms,
    [room.id]: room,
  };

  const lobbyUpdated: Lobby = {
    ...lobby,
    rooms: getRoomsAvailables(roomsUpdated),
    users: usersLobbyUpdated,
  };

  setRedis<Users>("users", usersUpdated);
  setRedis<Rooms>("rooms", roomsUpdated);
  setRedis<Lobby>("lobby", lobbyUpdated);

  io.to(idLobby).emit(EVENTS_SOCKET_SERVER.UPDATE_LOBBY, lobbyUpdated);
  return io.to(room.id).emit(EVENTS_SOCKET_SERVER.UPDATE_ROOM_LOBBY, room);
};
