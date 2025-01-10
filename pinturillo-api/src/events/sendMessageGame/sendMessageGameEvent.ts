import { v4 as uuidv4 } from "uuid";

import {
  CustomSocket,
  Message,
  Room,
  Rooms,
  Users,
} from "@src/entities/entities";
import { EVENTS_SOCKET_SERVER } from "@src/entities/enums";

import { getRedis, setRedis } from "@src/redisClient";

interface SendMessageGameEventProps extends CustomSocket {
  idRoom: string;
  message: string;
}

export const sendMessageGameEvent = async ({
  io,
  socket,
  idRoom,
  message,
}: SendMessageGameEventProps) => {
  const rooms = await getRedis<Rooms>("rooms");
  const users = await getRedis<Users>("users");

  const user = users[socket.id];
  const room = rooms[idRoom];

  const wordToGuess = room.wordToGuess.actualWord.toLocaleLowerCase();
  const userMessage = message.toLocaleLowerCase();

  const newMessage: Message = {
    id: uuidv4(),
    user: user,
    message: message,
  };

  const countdown = room.configuration.countdown.countdownGame;

  // NOTE: Si se tira una palabra y el contador llega a 0 o se esta eligiendo una palabra o si se tira una palabra que no es la que hay que adivinar
  if (
    countdown === 0 ||
    room.wordToGuess.wordsToChoose.length > 0 ||
    wordToGuess !== userMessage
  ) {
    return io
      .to(room.id)
      .emit(EVENTS_SOCKET_SERVER.SEND_MESSAGE_GAME, newMessage);
  }

  // NOTE: Se adivino la palabra
  // NOTE: Usuario adivina - Queda gente por adivinar
  const playersGuessUpdated = room.players.map((player) => {
    if (player.id === user.id && !player.guessed && !player.isPaiting) {
      player.guessed = true;
      player.score += Math.ceil((wordToGuess.length * countdown) / 1.2);
      newMessage.success = true;
    }

    return player;
  });

  const missingSomeoneGuess =
    playersGuessUpdated.find(
      (player) => !player.guessed && !player.isPaiting
    ) || null;

  let roomUpdated: Room = {
    ...room,
    players: playersGuessUpdated,
  };

  // TODO: Todos adivinaron - Nadie queda por adivinar
  if (!missingSomeoneGuess) {
    roomUpdated = {
      ...roomUpdated,
      configuration: {
        ...roomUpdated.configuration,
        countdown: {
          countdownGame: 0,
          countdownSelected:
            roomUpdated.configuration.countdown.countdownSelected,
        },
      },
    };
  }

  const roomsUpdated: Rooms = {
    ...rooms,
    [room.id]: roomUpdated,
  };

  setRedis<Rooms>("rooms", roomsUpdated);

  io.to(room.id).emit(EVENTS_SOCKET_SERVER.UPDATE_GAME, roomUpdated);

  return io
    .to(room.id)
    .emit(EVENTS_SOCKET_SERVER.SEND_MESSAGE_GAME, newMessage);
};
