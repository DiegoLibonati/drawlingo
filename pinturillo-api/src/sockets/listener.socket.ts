import { IO, OptionsRoom, Socket } from "@src/entities/app";
import { EVENTS_SOCKET_CLIENT } from "@src/entities/enums";

import { UserEvent } from "@src/sockets/events/user.event";
import { LobbyEvent } from "@src/sockets/events/lobby.event";
import { RoomEvent } from "@src/sockets/events/room.event";
import { GameEvent } from "@src/sockets/events/game.event";

export const registerSocketHandlers = (io: IO, socket: Socket) => {
  // User
  socket.on(
    EVENTS_SOCKET_CLIENT.CONNECT,
    ({
      username,
      pathToRedirect,
    }: {
      username: string;
      pathToRedirect: string;
    }) =>
      UserEvent.connect({
        io: io,
        socket: socket,
        username: username,
        pathToRedirect: pathToRedirect,
      })
  );

  socket.on(EVENTS_SOCKET_CLIENT.DISCONNECT, () =>
    UserEvent.disconnect({ io: io, socket: socket })
  );

  // Lobby
  socket.on(EVENTS_SOCKET_CLIENT.JOIN_LOBBY, async () =>
    LobbyEvent.join({ io: io, socket: socket })
  );

  socket.on(EVENTS_SOCKET_CLIENT.LEAVE_LOBBY, async () =>
    LobbyEvent.leave({ io: io, socket: socket })
  );

  socket.on(EVENTS_SOCKET_CLIENT.SEND_MESSAGE_LOBBY, (message: string) =>
    LobbyEvent.sendMessage({ io: io, socket: socket, message: message })
  );

  // Room
  socket.on(EVENTS_SOCKET_CLIENT.CREATE_ROOM, (optionsRoom: OptionsRoom) =>
    RoomEvent.create({ io: io, socket: socket, optionsRoom: optionsRoom })
  );

  socket.on(EVENTS_SOCKET_CLIENT.JOIN_ROOM_LOBBY, (idRoom: string) =>
    RoomEvent.join({ io, socket, idRoom })
  );

  socket.on(
    EVENTS_SOCKET_CLIENT.LOGIN_PRIVATE_ROOM,
    ({ idRoom, password }: { idRoom: string; password: string }) =>
      RoomEvent.loginPrivate({
        io: io,
        socket: socket,
        idRoom: idRoom,
        password: password,
      })
  );

  // Game
  socket.on(EVENTS_SOCKET_CLIENT.START_GAME, (idRoom: string) =>
    GameEvent.start({ io: io, socket: socket, idRoom: idRoom })
  );

  socket.on(EVENTS_SOCKET_CLIENT.JOIN_GAME, (idRoom: string) =>
    GameEvent.join({ io: io, socket: socket, idRoom: idRoom })
  );

  socket.on(
    EVENTS_SOCKET_CLIENT.WORD_SELECTED_GAME,
    ({ idRoom, wordSelected }: { idRoom: string; wordSelected: string }) =>
      GameEvent.wordSelected({
        io: io,
        socket: socket,
        idRoom: idRoom,
        wordSelected: wordSelected,
      })
  );

  socket.on(
    EVENTS_SOCKET_CLIENT.CANVAS_IMAGE_GAME,
    ({ idRoom, dataUrl }: { idRoom: string; dataUrl: string }) =>
      GameEvent.canvasImage({
        io: io,
        socket: socket,
        idRoom: idRoom,
        dataUrl: dataUrl,
      })
  );

  socket.on(EVENTS_SOCKET_CLIENT.CANVAS_CLEAR_GAME, (idRoom: string) =>
    GameEvent.canvasClear({ io: io, socket: socket, idRoom: idRoom })
  );

  socket.on(EVENTS_SOCKET_CLIENT.COUTNDOWN_GAME, async (idRoom: string) =>
    GameEvent.countdown({ io: io, socket: socket, idRoom: idRoom })
  );

  socket.on(
    EVENTS_SOCKET_CLIENT.SEND_MESSAGE_GAME,
    ({ idRoom, message }: { idRoom: string; message: string }) =>
      GameEvent.sendMessage({
        io: io,
        socket: socket,
        idRoom: idRoom,
        message: message,
      })
  );

  socket.on(EVENTS_SOCKET_CLIENT.NEW_PAINTER_GAME, (idRoom: string) =>
    GameEvent.newPainter({ io: io, socket: socket, idRoom: idRoom })
  );

  socket.on(EVENTS_SOCKET_CLIENT.NEXT_ROUND_GAME, (idRoom: string) =>
    GameEvent.nextRound({ io: io, socket: socket, idRoom: idRoom })
  );

  socket.on(EVENTS_SOCKET_CLIENT.FINISH_GAME, (idRoom: string) =>
    GameEvent.finish({ io: io, socket: socket, idRoom: idRoom })
  );
};
