import { Lobby, Room, Rooms, User, Users } from "@src/entities/app";
import { ConnectEventProps, DisconnectEventProps } from "@src/entities/props";
import { EVENTS_SOCKET_SERVER } from "@src/entities/enums";

import { RedisService } from "@src/services/redis.service";

import { getRoomsAvailables } from "@src/helpers/get_rooms_availables.helper";

import { idLobby } from "@src/constants/vars";

export const UserEvent = {
  connect: async ({
    io,
    socket,
    username,
    pathToRedirect,
  }: ConnectEventProps) => {
    const lobby = await RedisService.getLobby();
    const users = await RedisService.getUsers();

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

      RedisService.setUsers(usersUpdated);
      RedisService.setLobby(lobbyUpdated);

      io.to(idLobby).emit(EVENTS_SOCKET_SERVER.UPDATE_LOBBY, lobbyUpdated);
      return socket.emit(EVENTS_SOCKET_SERVER.CONNECT, {
        user: newUser,
        pathToRedirect: pathToRedirect,
      });
    }
  },
  disconnect: async ({ io, socket }: DisconnectEventProps) => {
    const users = await RedisService.getUsers();
    const rooms = await RedisService.getRooms();
    const lobby = await RedisService.getLobby();

    const socketUser = users[socket.id];

    if (!socketUser) {
      return;
    }

    // NOTE: Se desconecta el usuario que no pertenece a ninguna sala
    if (!socketUser.actualRoom) {
      delete users[socketUser.id];

      const lobbyUpdated = {
        ...lobby,
        appTotalPlayers: Object.keys(users).length,
      };

      RedisService.setUsers(users);
      RedisService.setLobby(lobbyUpdated);

      return socket
        .to(idLobby)
        .emit(EVENTS_SOCKET_SERVER.UPDATE_LOBBY, lobbyUpdated);
    }

    // NOTE: Se desconecta un usuario del lobby
    if (socketUser.actualRoom === idLobby) {
      delete users[socketUser.id];

      const lobbyUpdated = {
        ...lobby,
        users: lobby.users.filter((user) => user.id !== socketUser.id),
        appTotalPlayers: Object.keys(users).length,
      };

      RedisService.setUsers(users);
      RedisService.setLobby(lobbyUpdated);

      return socket
        .to(idLobby)
        .emit(EVENTS_SOCKET_SERVER.UPDATE_LOBBY, lobbyUpdated);
    }

    const room = rooms[socketUser.actualRoom];

    // NOTE: Se desconecta el dueño de una sala
    if (room.owner.id === socketUser.id) {
      const roomPlayers = room.players;

      roomPlayers.forEach((player) => {
        delete users[player.id];
        console.log("PLAYER ELIMINADO: ", users[socket.id]);
      });

      delete rooms[socketUser.actualRoom];

      const lobbyUpdated = {
        ...lobby,
        rooms: getRoomsAvailables(rooms),
        appTotalPlayers: Object.keys(users).length,
      };

      RedisService.setRooms(rooms);
      RedisService.setUsers(users);
      RedisService.setLobby(lobbyUpdated);

      io.to(idLobby).emit(EVENTS_SOCKET_SERVER.UPDATE_LOBBY, lobbyUpdated);
      return socket
        .to(room.id)
        .emit(EVENTS_SOCKET_SERVER.DISCONNECT, "The owner of the room left");
    }

    // NOTE: Se desconecta un usuario de una sala que no es el dueño
    const roomPlayers = room.players;
    const roomPlayersWithoutSocketDisconnected = roomPlayers.filter(
      (player) => player.id !== socketUser.id
    );

    // NOTE: Se desconecta un usuario de una sala que no es el dueño y no empezo.
    if (room.owner.id !== socketUser.id && !room.started) {
      delete users[socketUser.id];
      console.log("PLAYER ELIMINADO: ", users[socket.id]);

      const roomUpdated: Room = {
        ...room,
        players: roomPlayersWithoutSocketDisconnected,
      };

      const roomsUpdated: Rooms = {
        ...rooms,
        [room.id]: roomUpdated,
      };

      const lobbyUpdated = {
        ...lobby,
        rooms: getRoomsAvailables(roomsUpdated),
        appTotalPlayers: Object.keys(users).length,
      };

      RedisService.setRooms(roomsUpdated);
      RedisService.setUsers(users);
      RedisService.setLobby(lobbyUpdated);

      io.to(idLobby).emit(EVENTS_SOCKET_SERVER.UPDATE_LOBBY, lobbyUpdated);
      return io
        .to(room.id)
        .emit(EVENTS_SOCKET_SERVER.UPDATE_ROOM_LOBBY, roomUpdated);
    }

    // NOTE: Se desconecta un usuario, la sala ya se esta jugando y La sala queda con un solo jugador
    if (roomPlayersWithoutSocketDisconnected.length <= 1 && room.started) {
      roomPlayers.forEach((player) => {
        delete users[player.id];
        console.log("PLAYER ELIMINADO: ", users[socket.id]);
      });

      delete rooms[socketUser.actualRoom];

      const lobbyUpdated = {
        ...lobby,
        rooms: getRoomsAvailables(rooms),
        appTotalPlayers: Object.keys(users).length,
      };

      RedisService.setRooms(rooms);
      RedisService.setUsers(users);
      RedisService.setLobby(lobbyUpdated);

      io.to(idLobby).emit(EVENTS_SOCKET_SERVER.UPDATE_LOBBY, lobbyUpdated);
      return io
        .to(room.id)
        .emit(
          EVENTS_SOCKET_SERVER.DISCONNECT,
          "Game terminated due to lack of players"
        );
    }

    // NOTE: Se desconecta un usuario, la sala ya se esta jugando y no queda con un solo jugador
    if (
      room.owner.id !== socketUser.id &&
      room.started &&
      roomPlayersWithoutSocketDisconnected.length > 1
    ) {
      delete users[socketUser.id];
      console.log("PLAYER ELIMINADO: ", users[socket.id]);

      const roomUpdated: Room = {
        ...room,
        players: roomPlayersWithoutSocketDisconnected,
      };

      const roomsUpdated: Rooms = {
        ...rooms,
        [room.id]: roomUpdated,
      };

      const lobbyUpdated = {
        ...lobby,
        rooms: getRoomsAvailables(roomsUpdated),
        appTotalPlayers: Object.keys(users).length,
      };

      RedisService.setRooms(roomsUpdated);
      RedisService.setUsers(users);
      RedisService.setLobby(lobbyUpdated);

      io.to(idLobby).emit(EVENTS_SOCKET_SERVER.UPDATE_LOBBY, lobbyUpdated);
      return io.to(room.id).emit(EVENTS_SOCKET_SERVER.UPDATE_GAME, roomUpdated);
    }

    // TODO: EL QUE PINTA SI SE SALE

    console.log("No contemplo este IF - Disconnect Event");

    return;
  },
};
