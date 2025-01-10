import { v4 as uuidv4 } from "uuid";

import { CustomSocket, Message, Users } from "@src/entities/entities";
import { EVENTS_SOCKET_SERVER } from "@src/entities/enums";

import { getRedis } from "@src/redisClient";
import { idLobby } from "@src/constants/constants";

interface SendMessageLobbyEventProps extends CustomSocket {
  message: string;
}

export const sendMessageLobbyEvent = async ({
  io,
  socket,
  message,
}: SendMessageLobbyEventProps) => {
  const users = await getRedis<Users>("users");
  const socketUser = users[socket.id];

  const newMessage: Message = {
    id: uuidv4(),
    user: socketUser,
    message: message,
  };

  return io
    .to(idLobby)
    .emit(EVENTS_SOCKET_SERVER.SEND_MESSAGE_LOBBY, newMessage);
};
