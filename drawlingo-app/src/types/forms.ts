import type { CountdownRoom, RoundsRoom, SlotsRoom, TypeRoom } from "@/types/app";

export interface FormCanvas {
  size: number;
  color: string;
}

export interface FormChatGame {
  message: string;
}

export interface FormChatLobby {
  message: string;
}

export interface FormCreateRoom {
  name: string;
  type: TypeRoom;
  password: string;
  slots: SlotsRoom;
  totalRounds: RoundsRoom;
  countdown: CountdownRoom;
}

export interface FormLoginPrivate {
  idRoom: string;
  password: string;
}

export interface FormNickname {
  nickname: string;
}
