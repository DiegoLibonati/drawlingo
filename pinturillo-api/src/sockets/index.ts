import { Server as SocketIOServer } from "socket.io";
import { Server as HttpServer } from "http";

import { Socket } from "@src/entities/app";

import { envs } from "@src/configs/env.config";
import { registerSocketHandlers } from "@src/sockets/listener.socket";

const CLIENT_URL = envs.CLIENT_URL;

export const initSockets = (server: HttpServer) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: CLIENT_URL,
      credentials: true,
    },
  });

  io.on("connection", (socket: Socket) => {
    console.log("Client connected:", socket.id);

    registerSocketHandlers(io, socket);
  });
};
