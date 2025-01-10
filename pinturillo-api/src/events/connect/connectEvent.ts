import { CustomSocket, Lobby, User, Users } from "@src/entities/entities";

import { EVENTS_SOCKET_SERVER } from "@src/entities/enums";

import { getRedis, setRedis } from "@src/redisClient";
import { idLobby } from "@src/constants/constants";

interface ConnectEventProps extends CustomSocket {
  username: string;
  pathToRedirect: string;
}

export const connectEvent = async ({
  io,
  socket,
  username,
  pathToRedirect,
}: ConnectEventProps) => {
  const lobby = await getRedis<Lobby>("lobby");
  const users = await getRedis<Users>("users");

  const idUser = socket.id;

  if (!idUser) {
    console.log("ERROR - SOCKET ID - UNDEFINED");
    return;
  }

  const socketUser = users[idUser];

  if (!socketUser) {
    const newUser: User = {
      id: idUser,
      username: username,
      actualRoom: "", // NOTE: ESTO SIEMPRE ES "" PORQUE SE ESTA CONECTANDO.
    };

    const usersUpdated: Users = {
      ...users,
      [newUser.id]: newUser,
    };

    const lobbyUpdated: Lobby = {
      ...lobby,
      appTotalPlayers: Object.keys(usersUpdated).length,
    };

    setRedis<Users>("users", usersUpdated);
    setRedis<Lobby>("lobby", lobbyUpdated);

    io.to(idLobby).emit(EVENTS_SOCKET_SERVER.UPDATE_LOBBY, lobbyUpdated);
    return socket.emit(EVENTS_SOCKET_SERVER.CONNECT, {
      user: newUser,
      pathToRedirect: pathToRedirect,
    });
  }
};
