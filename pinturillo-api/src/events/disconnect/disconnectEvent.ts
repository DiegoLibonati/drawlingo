import {
  CustomSocket,
  Lobby,
  Room,
  Rooms,
  Users,
} from "@src/entities/entities";
import { EVENTS_SOCKET_SERVER } from "@src/entities/enums";

import { getRedis, setRedis } from "@src/redisClient";
import { getRoomsAvailables } from "@src/helpers/getRoomsAvailables";
import { idLobby } from "@src/constants/constants";

interface DisconnectEventProps extends CustomSocket {}

export const disconnectEvent = async ({ io, socket }: DisconnectEventProps) => {
  const users = await getRedis<Users>("users");
  const rooms = await getRedis<Rooms>("rooms");
  const lobby = await getRedis<Lobby>("lobby");

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

    setRedis<Users>("users", users);
    setRedis<Lobby>("lobby", lobbyUpdated);

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

    setRedis<Users>("users", users);
    setRedis<Lobby>("lobby", lobbyUpdated);

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

    setRedis<Rooms>("rooms", rooms);
    setRedis<Users>("users", users);
    setRedis<Lobby>("lobby", lobbyUpdated);

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

    setRedis<Users>("users", users);
    setRedis<Rooms>("rooms", roomsUpdated);
    setRedis<Lobby>("lobby", lobbyUpdated);

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

    setRedis<Users>("users", users);
    setRedis<Rooms>("rooms", rooms);
    setRedis<Lobby>("lobby", lobbyUpdated);

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

    setRedis<Users>("users", users);
    setRedis<Rooms>("rooms", roomsUpdated);
    setRedis<Lobby>("lobby", lobbyUpdated);

    io.to(idLobby).emit(EVENTS_SOCKET_SERVER.UPDATE_LOBBY, lobbyUpdated);
    return io.to(room.id).emit(EVENTS_SOCKET_SERVER.UPDATE_GAME, roomUpdated);
  }

  // TODO: EL QUE PINTA SI SE SALE

  console.log("No contemplo este IF - Disconnect Event");

  return;
};
