import { CustomSocket, Lobby, User, Users } from "@src/entities/entities";
import { EVENTS_SOCKET_SERVER } from "@src/entities/enums";

import { getRedis, setRedis } from "@src/redisClient";
import { idLobby } from "@src/constants/constants";

interface LeaveLobbyEventProps extends CustomSocket {}

export const leaveLobbyEvent = async ({ io, socket }: LeaveLobbyEventProps) => {
  const lobby = await getRedis<Lobby>("lobby");
  const users = await getRedis<Users>("users");

  const socketUser = users[socket.id];

  if (!socketUser) {
    return;
  }

  const userUpdated: User = {
    ...socketUser,
    actualRoom: "",
  };

  const usersUpdated: Users = {
    ...users,
    [socketUser.id]: userUpdated,
  };

  const lobbyUpdated: Lobby = {
    ...lobby,
    users: lobby.users.filter((user) => user.id !== socketUser.id),
  };

  setRedis<Users>("users", usersUpdated);
  setRedis<Lobby>("lobby", lobbyUpdated);

  return io.to(idLobby).emit(EVENTS_SOCKET_SERVER.UPDATE_LOBBY, lobbyUpdated);
};
