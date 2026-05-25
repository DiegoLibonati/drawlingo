import type { ZodType } from "zod";

declare module "express-serve-static-core" {
  interface Request {
    id: string;
  }
}

export type Env = "development" | "production" | "test";

export type LogLevel = "fatal" | "error" | "warn" | "info" | "debug" | "trace" | "silent";

export interface ValidateConfig {
  body?: ZodType;
  params?: ZodType;
  query?: ZodType;
}

// **** Room ****
export interface Room {
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
}

export type TypeRoom = "public" | "private";
export type RoundsRoom = 1 | 2 | 3;
export type SlotsRoom = 6 | 8;
export type CountdownRoom = 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90;

export interface OptionsRoom {
  name: string;
  type: TypeRoom;
  password: string;
  slots: SlotsRoom;
  totalRounds: RoundsRoom;
  countdown: CountdownRoom;
}

export type Rooms = Record<string, Room>;

// **** User In App ****

export interface User {
  id: string;
  username: string;
  actualRoom: string;
}

export type Users = Record<string, User>;

// **** Player In Game ****
export type Player = User & {
  isPainting: boolean;
  alreadyPainted: boolean;
  choosingAWord: boolean;
  score: number;
  guessed: boolean;
};

// **** Lobby ****

export interface Lobby {
  id: "lobby_room";
  rooms: Rooms;
  appTotalPlayers: number;
  users: User[];
}

// **** MessageLobby ****

export interface Message {
  id: string;
  user: User;
  message: string;
  success?: boolean;
}
