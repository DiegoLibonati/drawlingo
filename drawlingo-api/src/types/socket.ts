import type { Server as SocketServer, Socket as SocketBase } from "socket.io";
import type { Lobby, Message, OptionsRoom, Room, User } from "@/types/app";
import type { Ack } from "@/types/responses";
import type {
  CanvasImagePayload,
  ConnectPayload,
  LoginPrivateRoomPayload,
  SendMessageGamePayload,
  WordSelectedPayload,
} from "@/types/payloads";

export interface ClientToServerEvents {
  "custom connect": (
    payload: ConnectPayload,
    ack?: Ack<{ user: User; pathToRedirect: string }>
  ) => void;
  "join lobby": (ack?: Ack<Lobby>) => void;
  "leave lobby": (ack?: Ack<Lobby>) => void;
  "send message lobby": (message: string, ack?: Ack<Message>) => void;
  "create room": (optionsRoom: OptionsRoom, ack?: Ack<{ idRoom: string }>) => void;
  "join room lobby": (idRoom: string, ack?: Ack<Room>) => void;
  "login private room": (payload: LoginPrivateRoomPayload, ack?: Ack<{ idRoom: string }>) => void;
  "start game": (idRoom: string, ack?: Ack<null>) => void;
  "join game": (idRoom: string, ack?: Ack<Room>) => void;
  "word selected game": (payload: WordSelectedPayload, ack?: Ack<Room>) => void;
  "canvas image game": (payload: CanvasImagePayload, ack?: Ack<null>) => void;
  "canvas clear game": (idRoom: string, ack?: Ack<null>) => void;
  "countdown game": (idRoom: string, ack?: Ack<null>) => void;
  "send message game": (payload: SendMessageGamePayload, ack?: Ack<Message>) => void;
  "new painter game": (idRoom: string, ack?: Ack<Room>) => void;
  "next round game": (idRoom: string, ack?: Ack<Room>) => void;
  "finish game": (idRoom: string, ack?: Ack<null>) => void;
}

export interface ServerToClientEvents {
  "custom disconnect": (reason: string) => void;
  "update lobby": (lobby: Lobby) => void;
  "update room lobby": (room: Room) => void;
  "update game": (room: Room) => void;
  "send message lobby": (message: Message) => void;
  "start game": () => void;
  "canvas image game": (dataUrl: string) => void;
  "canvas clear game": () => void;
  "send message game": (message: Message) => void;
  "new painter game": () => void;
  "next round game": () => void;
  "finish game": () => void;
}

export type IO = SocketServer<ClientToServerEvents, ServerToClientEvents>;
export type Socket = SocketBase<ClientToServerEvents, ServerToClientEvents>;

export interface SocketContext {
  io: IO;
  socket: Socket;
}
