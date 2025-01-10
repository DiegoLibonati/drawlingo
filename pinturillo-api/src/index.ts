import { createServer } from "node:http";
import { Server } from "socket.io";

import { Lobby, OptionsRoom, Rooms, Users } from "@src/entities/entities";
import { EVENTS_SOCKET_CLIENT } from "@src/entities/enums";

import app from "@src/app";
import { config } from "@src/config";
import { getRedis, setRedis } from "@src/redisClient";
import { idLobby } from "@src/constants/constants";

import { connectEvent } from "@src/events/connect/connectEvent";
import { disconnectEvent } from "@src/events/disconnect/disconnectEvent";
import { joinLobbyEvent } from "@src/events/joinLobby/joinLobbyEvent";
import { leaveLobbyEvent } from "@src/events/leaveLobby/leaveLobbyEvent";
import { sendMessageLobbyEvent } from "@src/events/sendMessageLobby/sendMessageLobbyEvent";
import { createRoomEvent } from "@src/events/createRoom/createRoomEvent";
import { joinRoomLobbyEvent } from "@src/events/joinRoomLobby/joinRoomLobbyEvent";
import { loginPrivateRoomEvent } from "@src/events/loginPrivateRoom/loginPrivateRoomEvent";
import { startGameEvent } from "@src/events/startGame/startGameEvent";
import { JoinGameEvent } from "@src/events/joinGame/joinGameEvent";
import { wordSelectedGameEvent } from "@src/events/wordSelectedGame/wordSelectedGameEvent";
import { canvasImageGameEvent } from "@src/events/canvasImageGame/canvasImageGameEvent";
import { canvasClearGameEvent } from "@src/events/canvasClearGame/canvasClearGameEvent";
import { countdownGameEvent } from "@src/events/countdownGame/countdownGameEvent";
import { sendMessageGameEvent } from "@src/events/sendMessageGame/sendMessageGameEvent";
import { newPainterEvent } from "@src/events/newPainter/newPainterEvent";
import { nextRoundGameEvent } from "@src/events/nextRoundGame/nextRoundGameEvent";
import { finishGameEvent } from "@src/events/finishGame/finishGameEvent";

const server = createServer(app);

const PORT = config.API.PORT;
const CLIENT_URL = config.CLIENT.URL;

const INITIAL_USERS: Users = {};
const INITIAL_ROOMS: Rooms = {};
const INITIAL_LOBBY: Lobby = {
  id: idLobby,
  appTotalPlayers: Object.keys(INITIAL_USERS).length,
  users: [],
  rooms: INITIAL_ROOMS,
};

const io = new Server(server, {
  cors: {
    origin: CLIENT_URL,
    credentials: true,
  },
});

io.on("connection", async (socket) => {
  console.log("A user has connected!");

  socket.on(
    EVENTS_SOCKET_CLIENT.CONNECT,
    ({
      username,
      pathToRedirect,
    }: {
      username: string;
      pathToRedirect: string;
    }) =>
      connectEvent({
        io: io,
        socket: socket,
        username: username,
        pathToRedirect: pathToRedirect,
      })
  );

  socket.on(EVENTS_SOCKET_CLIENT.DISCONNECT, () =>
    disconnectEvent({ io: io, socket: socket })
  );

  socket.on(EVENTS_SOCKET_CLIENT.JOIN_LOBBY, async () =>
    joinLobbyEvent({ io: io, socket: socket })
  );

  socket.on(EVENTS_SOCKET_CLIENT.LEAVE_LOBBY, async () =>
    leaveLobbyEvent({ io: io, socket: socket })
  );

  socket.on(EVENTS_SOCKET_CLIENT.SEND_MESSAGE_LOBBY, (message: string) =>
    sendMessageLobbyEvent({ io: io, socket: socket, message: message })
  );

  socket.on(EVENTS_SOCKET_CLIENT.CREATE_ROOM, (optionsRoom: OptionsRoom) =>
    createRoomEvent({ io: io, socket: socket, optionsRoom: optionsRoom })
  );

  socket.on(EVENTS_SOCKET_CLIENT.JOIN_ROOM_LOBBY, (idRoom: string) =>
    joinRoomLobbyEvent({ io, socket, idRoom })
  );

  socket.on(
    EVENTS_SOCKET_CLIENT.LOGIN_PRIVATE_ROOM,
    ({ idRoom, password }: { idRoom: string; password: string }) =>
      loginPrivateRoomEvent({
        io: io,
        socket: socket,
        idRoom: idRoom,
        password: password,
      })
  );

  socket.on(EVENTS_SOCKET_CLIENT.START_GAME, (idRoom: string) =>
    startGameEvent({ io: io, socket: socket, idRoom: idRoom })
  );

  socket.on(EVENTS_SOCKET_CLIENT.JOIN_GAME, (idRoom: string) =>
    JoinGameEvent({ io: io, socket: socket, idRoom: idRoom })
  );

  socket.on(
    EVENTS_SOCKET_CLIENT.WORD_SELECTED_GAME,
    ({ idRoom, wordSelected }: { idRoom: string; wordSelected: string }) =>
      wordSelectedGameEvent({
        io: io,
        socket: socket,
        idRoom: idRoom,
        wordSelected: wordSelected,
      })
  );

  socket.on(
    EVENTS_SOCKET_CLIENT.CANVAS_IMAGE_GAME,
    ({ idRoom, dataUrl }: { idRoom: string; dataUrl: string }) =>
      canvasImageGameEvent({
        io: io,
        socket: socket,
        idRoom: idRoom,
        dataUrl: dataUrl,
      })
  );

  socket.on(EVENTS_SOCKET_CLIENT.CANVAS_CLEAR_GAME, (idRoom: string) =>
    canvasClearGameEvent({ io: io, socket: socket, idRoom: idRoom })
  );

  socket.on(EVENTS_SOCKET_CLIENT.COUTNDOWN_GAME, async (idRoom: string) =>
    countdownGameEvent({ io: io, socket: socket, idRoom: idRoom })
  );

  socket.on(
    EVENTS_SOCKET_CLIENT.SEND_MESSAGE_GAME,
    ({ idRoom, message }: { idRoom: string; message: string }) =>
      sendMessageGameEvent({
        io: io,
        socket: socket,
        idRoom: idRoom,
        message: message,
      })
  );

  socket.on(EVENTS_SOCKET_CLIENT.NEW_PAINTER_GAME, (idRoom: string) =>
    newPainterEvent({ io: io, socket: socket, idRoom: idRoom })
  );

  socket.on(EVENTS_SOCKET_CLIENT.NEXT_ROUND_GAME, (idRoom: string) =>
    nextRoundGameEvent({ io: io, socket: socket, idRoom: idRoom })
  );

  socket.on(EVENTS_SOCKET_CLIENT.FINISH_GAME, (idRoom: string) =>
    finishGameEvent({ io: io, socket: socket, idRoom: idRoom })
  );
});

const onInit = async (): Promise<void> => {
  console.log(`Server running on ${PORT}`);

  setRedis("users", INITIAL_USERS);
  setRedis("rooms", INITIAL_ROOMS);
  setRedis("lobby", INITIAL_LOBBY);

  const users = await getRedis<Users>("users");
  const rooms = await getRedis<Rooms>("rooms");
  const lobby = await getRedis<Lobby>("lobby");

  console.log("Users Restarted", users);
  console.log("Rooms Restarted", rooms);
  console.log("Lobby Restarted", lobby);
};

server.listen(PORT, onInit);
