import { v4 as uuidv4 } from "uuid";

import type { Lobby, Room, Rooms, Users } from "@/types/app";
import type {
  CreateRoomEventProps,
  JoinLobbyRoomEventProps,
  LoginPrivateRoomEventProps,
} from "@/types/props";

import { EVENTS_SOCKET_SERVER } from "@/constants/events.constant";
import { CODES_SUCCESS, CODES_ERROR } from "@/constants/codes.constant";
import { MESSAGES_SUCCESS, MESSAGES_ERROR } from "@/constants/messages.constant";
import { idLobby } from "@/constants/vars.constant";

import { RedisService } from "@/services/redis.service";

import { getExceptionMessage } from "@/helpers/get_exception_message.helper";
import { getRoomsAvailables } from "@/helpers/get_rooms_availables.helper";

export const RoomEvent = {
  create: async ({ io, socket, optionsRoom, ack }: CreateRoomEventProps): Promise<void> => {
    try {
      const idRoom = uuidv4();
      await socket.join(idRoom);

      const users: Users = JSON.parse((await RedisService.getUsers()) ?? "{}") as Users;
      const rooms: Rooms = JSON.parse((await RedisService.getRooms()) ?? "{}") as Rooms;
      const lobby: Lobby = JSON.parse((await RedisService.getLobby()) ?? "{}") as Lobby;

      const socketUser = users[socket.id]!;
      socketUser.actualRoom = idRoom;

      const { name, password, slots, totalRounds, type, countdown } = optionsRoom;

      const newRoom: Room = {
        id: idRoom,
        configuration: {
          name,
          slots,
          type,
          password,
          rounds: { totalRounds, actualRound: 1 },
          countdown: { countdownGame: countdown, countdownSelected: countdown },
        },
        players: [
          {
            ...socketUser,
            score: 0,
            isPainting: false,
            choosingAWord: false,
            alreadyPainted: false,
            guessed: false,
          },
        ],
        started: false,
        owner: socketUser,
        wordToGuess: { actualWord: "", wordsToChoose: [], wordWithPlaceholder: "" },
      };

      const usersUpdated: Users = { ...users, [socketUser.id]: socketUser };
      const roomsUpdated: Rooms = { ...rooms, [idRoom]: newRoom };
      const lobbyUpdated: Lobby = { ...lobby, rooms: getRoomsAvailables(roomsUpdated) };

      await RedisService.setUsers(usersUpdated);
      await RedisService.setRooms(roomsUpdated);
      await RedisService.setLobby(lobbyUpdated);

      ack({
        ok: true,
        code: CODES_SUCCESS.roomCreated,
        message: MESSAGES_SUCCESS.roomCreated,
        data: { idRoom },
      });
      io.to(idLobby).emit(EVENTS_SOCKET_SERVER.UPDATE_LOBBY, lobbyUpdated);
    } catch (e) {
      const { code, message } = getExceptionMessage(e);
      ack({ ok: false, code, message });
    }
  },

  join: async ({ io, socket, idRoom, ack }: JoinLobbyRoomEventProps): Promise<void> => {
    try {
      const users: Users = JSON.parse((await RedisService.getUsers()) ?? "{}") as Users;
      const rooms: Rooms = JSON.parse((await RedisService.getRooms()) ?? "{}") as Rooms;
      const lobby: Lobby = JSON.parse((await RedisService.getLobby()) ?? "{}") as Lobby;

      const socketUser = users[socket.id]!;
      const room = rooms[idRoom];

      if (!room) {
        ack({ ok: false, code: CODES_ERROR.generic, message: MESSAGES_ERROR.generic });
        return;
      }

      if (socketUser.id === room.owner.id) {
        ack({
          ok: true,
          code: CODES_SUCCESS.roomJoined,
          message: MESSAGES_SUCCESS.roomJoined,
          data: room,
        });
        return;
      }

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
          isPainting: false,
          choosingAWord: false,
          alreadyPainted: false,
          guessed: false,
        },
      ];

      const usersUpdated: Users = { ...users, [socketUser.id]: socketUser };
      const roomsUpdated: Rooms = { ...rooms, [room.id]: room };
      const lobbyUpdated: Lobby = {
        ...lobby,
        rooms: getRoomsAvailables(roomsUpdated),
        users: usersLobbyUpdated,
      };

      await RedisService.setUsers(usersUpdated);
      await RedisService.setRooms(roomsUpdated);
      await RedisService.setLobby(lobbyUpdated);

      ack({
        ok: true,
        code: CODES_SUCCESS.roomJoined,
        message: MESSAGES_SUCCESS.roomJoined,
        data: room,
      });
      io.to(idLobby).emit(EVENTS_SOCKET_SERVER.UPDATE_LOBBY, lobbyUpdated);
      io.to(room.id).emit(EVENTS_SOCKET_SERVER.UPDATE_ROOM_LOBBY, room);
    } catch (e) {
      const { code, message } = getExceptionMessage(e);
      ack({ ok: false, code, message });
    }
  },

  loginPrivate: async ({ ack, payload }: LoginPrivateRoomEventProps): Promise<void> => {
    try {
      const { idRoom, password } = payload;
      const rooms: Rooms = JSON.parse((await RedisService.getRooms()) ?? "{}") as Rooms;
      const roomToConnect = rooms[idRoom];

      if (!roomToConnect) {
        ack({
          ok: false,
          code: CODES_ERROR.generic,
          message: MESSAGES_ERROR.roomNotFound,
        });
        return;
      }

      if (roomToConnect.configuration.type !== "private") {
        ack({
          ok: false,
          code: CODES_ERROR.generic,
          message: MESSAGES_ERROR.roomNotPrivate,
        });
        return;
      }

      if (roomToConnect.configuration.password !== password) {
        ack({
          ok: false,
          code: CODES_ERROR.generic,
          message: MESSAGES_ERROR.roomPasswordIncorrect,
        });
        return;
      }

      ack({
        ok: true,
        code: CODES_SUCCESS.roomPrivateLogin,
        message: MESSAGES_SUCCESS.roomPrivateLogin,
        data: { idRoom: roomToConnect.id },
      });
    } catch (e) {
      const { code, message } = getExceptionMessage(e);
      ack({ ok: false, code, message });
    }
  },
};
