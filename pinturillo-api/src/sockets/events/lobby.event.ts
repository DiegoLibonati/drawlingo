import { v4 as uuidv4 } from "uuid";

import {
  JoinLobbyEventProps,
  LeaveLobbyEventProps,
  SendMessageLobbyEventProps,
} from "@src/entities/props";
import { Lobby, Message, User, Users } from "@src/entities/app";
import { EVENTS_SOCKET_SERVER } from "@src/entities/enums";

import { RedisService } from "@src/services/redis.service";

import { getRoomsAvailables } from "@src/helpers/get_rooms_availables.helper";

import { idLobby } from "@src/constants/vars";

export const LobbyEvent = {
  join: async ({ io, socket }: JoinLobbyEventProps) => {
    const users = await RedisService.getUsers();
    const rooms = await RedisService.getRooms();
    const lobby = await RedisService.getLobby();

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

    RedisService.setLobby(lobbyUpdated);
    RedisService.setUsers(usersUpdated);

    // NOTE: USING IO IN TO // sending to all clients in 'test' room, including sender
    // NOTE: USING socket IN TO // sending to all clients in 'test' room except sender
    return io.to(idLobby).emit(EVENTS_SOCKET_SERVER.UPDATE_LOBBY, lobbyUpdated);
  },
  leave: async ({ io, socket }: LeaveLobbyEventProps) => {
    const lobby = await RedisService.getLobby();
    const users = await RedisService.getUsers();

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

    RedisService.setUsers(usersUpdated);
    RedisService.setLobby(lobbyUpdated);

    return io.to(idLobby).emit(EVENTS_SOCKET_SERVER.UPDATE_LOBBY, lobbyUpdated);
  },
  sendMessage: async ({ io, socket, message }: SendMessageLobbyEventProps) => {
    const users = await RedisService.getUsers();
    const socketUser = users[socket.id];

    const newMessage: Message = {
      id: uuidv4(),
      user: socketUser,
      message: message,
    };

    return io
      .to(idLobby)
      .emit(EVENTS_SOCKET_SERVER.SEND_MESSAGE_LOBBY, newMessage);
  },
};
