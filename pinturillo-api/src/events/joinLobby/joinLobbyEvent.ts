import { CustomSocket, Lobby, Rooms, Users } from "@src/entities/entities";
import { EVENTS_SOCKET_SERVER } from "@src/entities/enums";

import { getRedis, setRedis } from "@src/redisClient";
import { getRoomsAvailables } from "@src/helpers/getRoomsAvailables";
import { idLobby } from "@src/constants/constants";

interface JoinLobbyEventProps extends CustomSocket {}

export const joinLobbyEvent = async ({ io, socket }: JoinLobbyEventProps) => {
  const users = await getRedis<Users>("users");
  const rooms = await getRedis<Rooms>("rooms");
  const lobby = await getRedis<Lobby>("lobby");

  const socketUser = users[socket.id];

  if (!socketUser) {
    return;
  }

  await socket.join(idLobby);

  socketUser.actualRoom = idLobby;

  console.log("Conectado a socket", socket.rooms);
  console.log("Se conecto", socketUser.username);

  const usersUpdated: Users = {
    ...users,
    [socketUser.id]: socketUser,
  };

  const lobbyUpdated: Lobby = {
    ...lobby,
    users: [...lobby.users, socketUser],
    rooms: getRoomsAvailables(rooms),
  };

  setRedis<Lobby>("lobby", lobbyUpdated);
  setRedis<Users>("users", usersUpdated);

  // NOTE: USING IO IN TO // sending to all clients in 'test' room, including sender
  // NOTE: USING socket IN TO // sending to all clients in 'test' room except sender
  return io.to(idLobby).emit(EVENTS_SOCKET_SERVER.UPDATE_LOBBY, lobbyUpdated);
};
