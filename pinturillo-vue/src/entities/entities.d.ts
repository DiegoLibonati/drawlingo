// ** Types **

import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

// **** Room ****
export type Room = {
  id: string;
  configuration: {
    name: string;
    slots: SlotsRoom;
    type: TypeRoom;
    password: string;
    rounds: {
      totalRounds: RoundsRoom;
      actualRound: number;
    };
    countdown: {
      countdownSelected: CountdownRoom;
      countdownGame: number;
    };
  };
  players: Player[];
  started: boolean;
  owner: User;
  wordToGuess: {
    actualWord: string;
    wordWithPlaceholder: string;
    wordsToChoose: string[];
  };
};

export type TypeRoom = "public" | "private";
export type RoundsRoom = 1 | 2 | 3;
export type SlotsRoom = 6 | 8;
export type CountdownRoom = 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90;

export type OptionsRoom = {
  name: string;
  type: TypeRoom;
  password: string;
  slots: SlotsRoom;
  totalRounds: RoundsRoom;
  countdown: CountdownRoom;
};

export type Rooms = Record<string, Room>;

// **** User In App ****

export type User = {
  id: string;
  username: string;
  actualRoom: string;
};

export type Users = Record<string, User>;

// **** Player In Game ****
export type Player = User & {
  isPaiting: boolean;
  alreadyPainted: boolean;
  choosingAWord: boolean;
  score: number;
  guessed: boolean;
};

// **** Lobby ****

export type Lobby = {
  id: "lobby_room";
  rooms: Rooms;
  appTotalPlayers: number;
  users: User[];
};

// **** Canvas ****

export type Canvas = {
  canDraw: boolean;
  pos: { x: number; y: number };
  color: string;
  size: number;
  canvas: HTMLCanvasElement | null;
};

// **** MessageLobby ****

export type Message = {
  id: string;
  user: User;
  message: string;
  success?: boolean;
};

// **** Socket ****
export type CustomSocket = {
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
};

// **** Front ****

export type Alert = {
  type: "" | "info" | "warning" | "error";
  message: string;
};
