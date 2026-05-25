import { v4 as uuidv4 } from "uuid";

import type {
  JoinLobbyEventProps,
  LeaveLobbyEventProps,
  SendMessageLobbyEventProps,
} from "@/types/props";
import type { Lobby, Message, Rooms, User, Users } from "@/types/app";

import { EVENTS_SOCKET_SERVER } from "@/constants/events.constant";
import { CODES_SUCCESS, CODES_ERROR } from "@/constants/codes.constant";
import { MESSAGES_SUCCESS, MESSAGES_ERROR } from "@/constants/messages.constant";
import { idLobby } from "@/constants/vars.constant";

import { RedisService } from "@/services/redis.service";

import { getExceptionMessage } from "@/helpers/get_exception_message.helper";
import { getRoomsAvailables } from "@/helpers/get_rooms_availables.helper";

export const LobbyEvent = {
  join: async ({ io, socket, ack }: JoinLobbyEventProps): Promise<void> => {
    try {
      const users: Users = JSON.parse((await RedisService.getUsers()) ?? "{}") as Users;
      const rooms: Rooms = JSON.parse((await RedisService.getRooms()) ?? "{}") as Rooms;
      const lobby: Lobby = JSON.parse((await RedisService.getLobby()) ?? "{}") as Lobby;

      const socketUser = users[socket.id];
      if (!socketUser) {
        ack({ ok: false, code: CODES_ERROR.generic, message: MESSAGES_ERROR.generic });
        return;
      }

      await socket.join(idLobby);
      socketUser.actualRoom = idLobby;

      const usersUpdated: Users = { ...users, [socketUser.id]: socketUser };
      const lobbyUpdated: Lobby = {
        ...lobby,
        users: [...lobby.users, socketUser],
        rooms: getRoomsAvailables(rooms),
      };

      await RedisService.setLobby(lobbyUpdated);
      await RedisService.setUsers(usersUpdated);

      ack({
        ok: true,
        code: CODES_SUCCESS.lobbyJoined,
        message: MESSAGES_SUCCESS.lobbyJoined,
        data: lobbyUpdated,
      });
      io.to(idLobby).emit(EVENTS_SOCKET_SERVER.UPDATE_LOBBY, lobbyUpdated);
    } catch (e) {
      const { code, message } = getExceptionMessage(e);
      ack({ ok: false, code, message });
    }
  },

  leave: async ({ io, socket, ack }: LeaveLobbyEventProps): Promise<void> => {
    try {
      const lobby: Lobby = JSON.parse((await RedisService.getLobby()) ?? "{}") as Lobby;
      const users: Users = JSON.parse((await RedisService.getUsers()) ?? "{}") as Users;

      const socketUser = users[socket.id];
      if (!socketUser) {
        ack({ ok: false, code: CODES_ERROR.generic, message: MESSAGES_ERROR.generic });
        return;
      }

      const userUpdated: User = { ...socketUser, actualRoom: "" };
      const usersUpdated: Users = { ...users, [socketUser.id]: userUpdated };
      const lobbyUpdated: Lobby = {
        ...lobby,
        users: lobby.users.filter((user) => user.id !== socketUser.id),
      };

      await RedisService.setUsers(usersUpdated);
      await RedisService.setLobby(lobbyUpdated);

      ack({
        ok: true,
        code: CODES_SUCCESS.lobbyLeft,
        message: MESSAGES_SUCCESS.lobbyLeft,
        data: lobbyUpdated,
      });
      io.to(idLobby).emit(EVENTS_SOCKET_SERVER.UPDATE_LOBBY, lobbyUpdated);
    } catch (e) {
      const { code, message } = getExceptionMessage(e);
      ack({ ok: false, code, message });
    }
  },

  sendMessage: async ({ io, socket, message, ack }: SendMessageLobbyEventProps): Promise<void> => {
    try {
      const users: Users = JSON.parse((await RedisService.getUsers()) ?? "{}") as Users;
      const socketUser = users[socket.id]!;

      const newMessage: Message = {
        id: uuidv4(),
        user: socketUser,
        message,
      };

      ack({
        ok: true,
        code: CODES_SUCCESS.lobbyMessageSent,
        message: MESSAGES_SUCCESS.lobbyMessageSent,
        data: newMessage,
      });
      io.to(idLobby).emit(EVENTS_SOCKET_SERVER.SEND_MESSAGE_LOBBY, newMessage);
    } catch (e) {
      const { code, message } = getExceptionMessage(e);
      ack({ ok: false, code, message });
    }
  },
};
