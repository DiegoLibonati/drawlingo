import type { Lobby, Room, Rooms, User, Users } from "@/types/app";
import type { ConnectEventProps, DisconnectEventProps } from "@/types/props";

import { EVENTS_SOCKET_SERVER } from "@/constants/events.constant";
import { CODES_SUCCESS, CODES_ERROR } from "@/constants/codes.constant";
import { MESSAGES_SUCCESS, MESSAGES_ERROR } from "@/constants/messages.constant";
import { idLobby } from "@/constants/vars.constant";

import { RedisService } from "@/services/redis.service";

import { getExceptionMessage } from "@/helpers/get_exception_message.helper";
import { getRoomsAvailables } from "@/helpers/get_rooms_availables.helper";

import { logger } from "@/configs/logger.config";

export const UserEvent = {
  connect: async ({ io, socket, payload, ack }: ConnectEventProps): Promise<void> => {
    try {
      const { username, pathToRedirect } = payload;

      const lobby: Lobby = JSON.parse((await RedisService.getLobby()) ?? "{}") as Lobby;
      const users: Users = JSON.parse((await RedisService.getUsers()) ?? "{}") as Users;

      const socketUser = users[socket.id];
      if (socketUser) {
        ack({ ok: false, code: CODES_ERROR.generic, message: MESSAGES_ERROR.userAlreadyConnected });
        return;
      }

      const newUser: User = {
        id: socket.id,
        username,
        actualRoom: "",
      };

      const usersUpdated: Users = { ...users, [newUser.id]: newUser };
      const lobbyUpdated: Lobby = {
        ...lobby,
        appTotalPlayers: Object.keys(usersUpdated).length,
      };

      await RedisService.setUsers(usersUpdated);
      await RedisService.setLobby(lobbyUpdated);

      ack({
        ok: true,
        code: CODES_SUCCESS.userConnected,
        message: MESSAGES_SUCCESS.userConnected,
        data: { user: newUser, pathToRedirect },
      });
      io.to(idLobby).emit(EVENTS_SOCKET_SERVER.UPDATE_LOBBY, lobbyUpdated);
    } catch (e) {
      const { code, message } = getExceptionMessage(e);
      ack({ ok: false, code, message });
    }
  },

  disconnect: async ({ io, socket }: DisconnectEventProps): Promise<void> => {
    try {
      const users: Users = JSON.parse((await RedisService.getUsers()) ?? "{}") as Users;
      const rooms: Rooms = JSON.parse((await RedisService.getRooms()) ?? "{}") as Rooms;
      const lobby: Lobby = JSON.parse((await RedisService.getLobby()) ?? "{}") as Lobby;

      const socketUser = users[socket.id];

      if (!socketUser) return;

      if (!socketUser.actualRoom) {
        const usersUpdated: Users = Object.fromEntries(
          Object.entries(users).filter(([id]) => id !== socketUser.id)
        );
        const lobbyUpdated: Lobby = {
          ...lobby,
          appTotalPlayers: Object.keys(usersUpdated).length,
        };

        await RedisService.setUsers(usersUpdated);
        await RedisService.setLobby(lobbyUpdated);

        socket.to(idLobby).emit(EVENTS_SOCKET_SERVER.UPDATE_LOBBY, lobbyUpdated);
        return;
      }

      if (socketUser.actualRoom === idLobby) {
        const usersUpdated: Users = Object.fromEntries(
          Object.entries(users).filter(([id]) => id !== socketUser.id)
        );
        const lobbyUpdated: Lobby = {
          ...lobby,
          users: lobby.users.filter((user) => user.id !== socketUser.id),
          appTotalPlayers: Object.keys(usersUpdated).length,
        };

        await RedisService.setUsers(usersUpdated);
        await RedisService.setLobby(lobbyUpdated);

        socket.to(idLobby).emit(EVENTS_SOCKET_SERVER.UPDATE_LOBBY, lobbyUpdated);
        return;
      }

      const room = rooms[socketUser.actualRoom]!;

      if (room.owner.id === socketUser.id) {
        const playerIds = new Set(room.players.map((p) => p.id));
        const usersUpdated: Users = Object.fromEntries(
          Object.entries(users).filter(([id]) => !playerIds.has(id))
        );
        const roomsUpdated: Rooms = Object.fromEntries(
          Object.entries(rooms).filter(([id]) => id !== socketUser.actualRoom)
        );
        const lobbyUpdated: Lobby = {
          ...lobby,
          rooms: getRoomsAvailables(roomsUpdated),
          appTotalPlayers: Object.keys(usersUpdated).length,
        };

        await RedisService.setRooms(roomsUpdated);
        await RedisService.setUsers(usersUpdated);
        await RedisService.setLobby(lobbyUpdated);

        io.to(idLobby).emit(EVENTS_SOCKET_SERVER.UPDATE_LOBBY, lobbyUpdated);
        socket.to(room.id).emit(EVENTS_SOCKET_SERVER.DISCONNECT, MESSAGES_ERROR.roomOwnerLeft);
        return;
      }

      const roomPlayersWithoutDisconnected = room.players.filter(
        (player) => player.id !== socketUser.id
      );

      if (!room.started) {
        const usersUpdated: Users = Object.fromEntries(
          Object.entries(users).filter(([id]) => id !== socketUser.id)
        );
        const roomUpdated: Room = { ...room, players: roomPlayersWithoutDisconnected };
        const roomsUpdated: Rooms = { ...rooms, [room.id]: roomUpdated };
        const lobbyUpdated: Lobby = {
          ...lobby,
          rooms: getRoomsAvailables(roomsUpdated),
          appTotalPlayers: Object.keys(usersUpdated).length,
        };

        await RedisService.setRooms(roomsUpdated);
        await RedisService.setUsers(usersUpdated);
        await RedisService.setLobby(lobbyUpdated);

        io.to(idLobby).emit(EVENTS_SOCKET_SERVER.UPDATE_LOBBY, lobbyUpdated);
        io.to(room.id).emit(EVENTS_SOCKET_SERVER.UPDATE_ROOM_LOBBY, roomUpdated);
        return;
      }

      if (roomPlayersWithoutDisconnected.length <= 1) {
        const playerIds = new Set(room.players.map((p) => p.id));
        const usersUpdated: Users = Object.fromEntries(
          Object.entries(users).filter(([id]) => !playerIds.has(id))
        );
        const roomsUpdated: Rooms = Object.fromEntries(
          Object.entries(rooms).filter(([id]) => id !== socketUser.actualRoom)
        );
        const lobbyUpdated: Lobby = {
          ...lobby,
          rooms: getRoomsAvailables(roomsUpdated),
          appTotalPlayers: Object.keys(usersUpdated).length,
        };

        await RedisService.setRooms(roomsUpdated);
        await RedisService.setUsers(usersUpdated);
        await RedisService.setLobby(lobbyUpdated);

        io.to(idLobby).emit(EVENTS_SOCKET_SERVER.UPDATE_LOBBY, lobbyUpdated);
        io.to(room.id).emit(EVENTS_SOCKET_SERVER.DISCONNECT, MESSAGES_ERROR.gameLackOfPlayers);
        return;
      }

      const usersUpdated: Users = Object.fromEntries(
        Object.entries(users).filter(([id]) => id !== socketUser.id)
      );
      const roomUpdated: Room = { ...room, players: roomPlayersWithoutDisconnected };
      const roomsUpdated: Rooms = { ...rooms, [room.id]: roomUpdated };
      const lobbyUpdated: Lobby = {
        ...lobby,
        rooms: getRoomsAvailables(roomsUpdated),
        appTotalPlayers: Object.keys(usersUpdated).length,
      };

      await RedisService.setRooms(roomsUpdated);
      await RedisService.setUsers(usersUpdated);
      await RedisService.setLobby(lobbyUpdated);

      io.to(idLobby).emit(EVENTS_SOCKET_SERVER.UPDATE_LOBBY, lobbyUpdated);
      io.to(room.id).emit(EVENTS_SOCKET_SERVER.UPDATE_GAME, roomUpdated);
    } catch (e) {
      const { message } = getExceptionMessage(e);
      logger.error({ err: e, socketId: socket.id }, message);
    }
  },
};
