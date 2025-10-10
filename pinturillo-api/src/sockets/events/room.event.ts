import { v4 as uuidv4 } from "uuid";

import { Lobby, Room, Rooms, Users } from "@src/entities/app";
import {
  CreateRoomEventProps,
  JoinLobbyRoomEventProps,
  LoginPrivateRoomEventProps,
} from "@src/entities/props";
import { EVENTS_SOCKET_SERVER } from "@src/entities/enums";

import { RedisService } from "@src/services/redis.service";

import { getRoomsAvailables } from "@src/helpers/get_rooms_availables.helper";

import { idLobby } from "@src/constants/vars";

export const RoomEvent = {
  create: async ({ io, socket, optionsRoom }: CreateRoomEventProps) => {
    const idRoom = uuidv4();
    await socket.join(idRoom);

    const users = await RedisService.getUsers();
    const rooms = await RedisService.getRooms();
    const lobby = await RedisService.getLobby();

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
          isPainting: false,
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

    RedisService.setUsers(usersUpdated);
    RedisService.setRooms(roomsUpdated);
    RedisService.setLobby(lobbyUpdated);

    socket.emit(EVENTS_SOCKET_SERVER.CREATE_ROOM, idRoom);
    return io.to(idLobby).emit(EVENTS_SOCKET_SERVER.UPDATE_LOBBY, lobbyUpdated);
  },
  join: async ({ io, socket, idRoom }: JoinLobbyRoomEventProps) => {
    const users = await RedisService.getUsers();
    const rooms = await RedisService.getRooms();
    const lobby = await RedisService.getLobby();

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
        isPainting: false,
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

    RedisService.setUsers(usersUpdated);
    RedisService.setRooms(roomsUpdated);
    RedisService.setLobby(lobbyUpdated);

    io.to(idLobby).emit(EVENTS_SOCKET_SERVER.UPDATE_LOBBY, lobbyUpdated);
    return io.to(room.id).emit(EVENTS_SOCKET_SERVER.UPDATE_ROOM_LOBBY, room);
  },
  loginPrivate: async ({
    socket,
    idRoom,
    password,
  }: LoginPrivateRoomEventProps) => {
    const rooms = await RedisService.getRooms();
    const roomToConnect = rooms[idRoom];

    if (!roomToConnect) {
      return socket.emit(EVENTS_SOCKET_SERVER.LOGIN_PRIVATE_ROOM, {
        success: false,
        message: "There is no room with the entered ID",
      });
    }

    if (roomToConnect.configuration.type !== "private") {
      return socket.emit(EVENTS_SOCKET_SERVER.LOGIN_PRIVATE_ROOM, {
        success: false,
        message: "The room you want to connect to is public, not private.",
      });
    }

    if (roomToConnect.configuration.password !== password) {
      return socket.emit(EVENTS_SOCKET_SERVER.LOGIN_PRIVATE_ROOM, {
        success: false,
        message: "The password entered is incorrect",
      });
    }

    return socket.emit(EVENTS_SOCKET_SERVER.LOGIN_PRIVATE_ROOM, {
      success: true,
      message: "You are entering the room",
      idRoom: roomToConnect.id,
    });
  },
};
