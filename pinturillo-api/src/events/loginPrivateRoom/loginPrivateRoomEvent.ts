import { CustomSocket, Rooms } from "@src/entities/entities";
import { EVENTS_SOCKET_SERVER } from "@src/entities/enums";

import { getRedis } from "@src/redisClient";

interface LoginPrivateRoomEventProps extends CustomSocket {
  idRoom: string;
  password: string;
}

export const loginPrivateRoomEvent = async ({
  socket,
  idRoom,
  password,
}: LoginPrivateRoomEventProps) => {
  const rooms = await getRedis<Rooms>("rooms");
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
};
