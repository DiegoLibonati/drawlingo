import type { Lobby, Message, OptionsRoom, Room, User } from "@/types/app";
import type { Ack } from "@/types/responses";
import type { SocketContext } from "@/types/socket";
import type {
  CanvasImagePayload,
  ConnectPayload,
  LoginPrivateRoomPayload,
  SendMessageGamePayload,
  WordSelectedPayload,
} from "@/types/payloads";

export interface ConnectEventProps extends SocketContext {
  payload: ConnectPayload;
  ack: Ack<{ user: User; pathToRedirect: string }>;
}

export type DisconnectEventProps = SocketContext;

export interface JoinLobbyEventProps extends SocketContext {
  ack: Ack<Lobby>;
}

export interface LeaveLobbyEventProps extends SocketContext {
  ack: Ack<Lobby>;
}

export interface SendMessageLobbyEventProps extends SocketContext {
  message: string;
  ack: Ack<Message>;
}

export interface CreateRoomEventProps extends SocketContext {
  optionsRoom: OptionsRoom;
  ack: Ack<{ idRoom: string }>;
}

export interface JoinLobbyRoomEventProps extends SocketContext {
  idRoom: string;
  ack: Ack<Room>;
}

export interface LoginPrivateRoomEventProps extends SocketContext {
  payload: LoginPrivateRoomPayload;
  ack: Ack<{ idRoom: string }>;
}

export interface StartGameEventsProps extends SocketContext {
  idRoom: string;
  ack: Ack<null>;
}

export interface JoinGameEventProps extends SocketContext {
  idRoom: string;
  ack: Ack<Room>;
}

export interface WordSelectedGameEventProps extends SocketContext {
  payload: WordSelectedPayload;
  ack: Ack<Room>;
}

export interface CanvasImageGameEventProps extends SocketContext {
  payload: CanvasImagePayload;
  ack: Ack<null>;
}

export interface CanvasClearGameEventProps extends SocketContext {
  idRoom: string;
  ack: Ack<null>;
}

export interface CountdownGameEventProps extends SocketContext {
  idRoom: string;
  ack: Ack<null>;
}

export interface SendMessageGameEventProps extends SocketContext {
  payload: SendMessageGamePayload;
  ack: Ack<Message>;
}

export interface NewPainterGameEventProps extends SocketContext {
  idRoom: string;
  ack: Ack<Room>;
}

export interface NextRoundGameEventProps extends SocketContext {
  idRoom: string;
  ack: Ack<Room>;
}

export interface FinishGameEventProps extends SocketContext {
  idRoom: string;
  ack: Ack<null>;
}
