import type { IO, Socket } from "@/types/socket";

import { EVENTS_SOCKET_CLIENT } from "@/constants/events.constant";

import { safeAck } from "@/helpers/safe_ack.helper";

import { UserEvent } from "@/sockets/events/user.event";
import { LobbyEvent } from "@/sockets/events/lobby.event";
import { RoomEvent } from "@/sockets/events/room.event";
import { GameEvent } from "@/sockets/events/game.event";

export const registerSocketHandlers = (io: IO, socket: Socket): void => {
  socket.on(EVENTS_SOCKET_CLIENT.CONNECT, (payload, ack) => {
    void UserEvent.connect({ io, socket, payload, ack: safeAck(ack) });
  });

  socket.on("disconnect", () => {
    void UserEvent.disconnect({ io, socket });
  });

  socket.on(EVENTS_SOCKET_CLIENT.JOIN_LOBBY, (ack) => {
    void LobbyEvent.join({ io, socket, ack: safeAck(ack) });
  });

  socket.on(EVENTS_SOCKET_CLIENT.LEAVE_LOBBY, (ack) => {
    void LobbyEvent.leave({ io, socket, ack: safeAck(ack) });
  });

  socket.on(EVENTS_SOCKET_CLIENT.SEND_MESSAGE_LOBBY, (message, ack) => {
    void LobbyEvent.sendMessage({ io, socket, message, ack: safeAck(ack) });
  });

  socket.on(EVENTS_SOCKET_CLIENT.CREATE_ROOM, (optionsRoom, ack) => {
    void RoomEvent.create({ io, socket, optionsRoom, ack: safeAck(ack) });
  });

  socket.on(EVENTS_SOCKET_CLIENT.JOIN_ROOM_LOBBY, (idRoom, ack) => {
    void RoomEvent.join({ io, socket, idRoom, ack: safeAck(ack) });
  });

  socket.on(EVENTS_SOCKET_CLIENT.LOGIN_PRIVATE_ROOM, (payload, ack) => {
    void RoomEvent.loginPrivate({ io, socket, payload, ack: safeAck(ack) });
  });

  socket.on(EVENTS_SOCKET_CLIENT.START_GAME, (idRoom, ack) => {
    GameEvent.start({ io, socket, idRoom, ack: safeAck(ack) });
  });

  socket.on(EVENTS_SOCKET_CLIENT.JOIN_GAME, (idRoom, ack) => {
    void GameEvent.join({ io, socket, idRoom, ack: safeAck(ack) });
  });

  socket.on(EVENTS_SOCKET_CLIENT.WORD_SELECTED_GAME, (payload, ack) => {
    void GameEvent.wordSelected({ io, socket, payload, ack: safeAck(ack) });
  });

  socket.on(EVENTS_SOCKET_CLIENT.CANVAS_IMAGE_GAME, (payload, ack) => {
    GameEvent.canvasImage({ io, socket, payload, ack: safeAck(ack) });
  });

  socket.on(EVENTS_SOCKET_CLIENT.CANVAS_CLEAR_GAME, (idRoom, ack) => {
    GameEvent.canvasClear({ io, socket, idRoom, ack: safeAck(ack) });
  });

  socket.on(EVENTS_SOCKET_CLIENT.COUNTDOWN_GAME, (idRoom, ack) => {
    void GameEvent.countdown({ io, socket, idRoom, ack: safeAck(ack) });
  });

  socket.on(EVENTS_SOCKET_CLIENT.SEND_MESSAGE_GAME, (payload, ack) => {
    void GameEvent.sendMessage({ io, socket, payload, ack: safeAck(ack) });
  });

  socket.on(EVENTS_SOCKET_CLIENT.NEW_PAINTER_GAME, (idRoom, ack) => {
    void GameEvent.newPainter({ io, socket, idRoom, ack: safeAck(ack) });
  });

  socket.on(EVENTS_SOCKET_CLIENT.NEXT_ROUND_GAME, (idRoom, ack) => {
    void GameEvent.nextRound({ io, socket, idRoom, ack: safeAck(ack) });
  });

  socket.on(EVENTS_SOCKET_CLIENT.FINISH_GAME, (idRoom, ack) => {
    void GameEvent.finish({ io, socket, idRoom, ack: safeAck(ack) });
  });
};
