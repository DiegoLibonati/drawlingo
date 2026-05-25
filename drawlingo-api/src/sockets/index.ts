import { Server as SocketIOServer } from "socket.io";

import type { Server as HttpServer } from "http";
import type { IO } from "@/types/socket";

import { envs } from "@/configs/env.config";

import { registerSocketHandlers } from "@/sockets/listener.socket";

export const initSockets = (server: HttpServer): IO => {
  const io: IO = new SocketIOServer(server, {
    cors: {
      origin: envs.CLIENT_URL,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`[socket] connected: ${socket.id}`);

    registerSocketHandlers(io, socket);

    socket.on("disconnect", (reason) => {
      console.log(`[socket] disconnected: ${socket.id} (${reason})`);
    });
  });

  return io;
};
