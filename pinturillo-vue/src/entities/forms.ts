import {
  CountdownRoom,
  RoundsRoom,
  SlotsRoom,
  TypeRoom,
} from "@src/entities/app";

export type FormCanvas = {
  size: number;
  color: string;
};

export type FormChatGame = {
  message: string;
};

export type FormChatLobby = {
  message: string;
};

export type FormCreateRoom = {
  name: string;
  type: TypeRoom;
  password: string;
  slots: SlotsRoom;
  totalRounds: RoundsRoom;
  countdown: CountdownRoom;
};

export type FormLoginPrivate = {
  idRoom: string;
  password: string;
};

export type FormNickname = {
  nickname: string;
};
