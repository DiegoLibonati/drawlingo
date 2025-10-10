import { CustomSocket, OptionsRoom } from "@src/entities/app";

export interface ConnectEventProps extends CustomSocket {
  username: string;
  pathToRedirect: string;
}

export interface DisconnectEventProps extends CustomSocket {}

export interface CreateRoomEventProps extends CustomSocket {
  optionsRoom: OptionsRoom;
}

export interface JoinLobbyRoomEventProps extends CustomSocket {
  idRoom: string;
}

export interface LoginPrivateRoomEventProps extends CustomSocket {
  idRoom: string;
  password: string;
}

export interface JoinLobbyEventProps extends CustomSocket {}

export interface LeaveLobbyEventProps extends CustomSocket {}

export interface SendMessageLobbyEventProps extends CustomSocket {
  message: string;
}

export interface StartGameEventsProps extends CustomSocket {
  idRoom: string;
}

export interface JoinGameEventProps extends CustomSocket {
  idRoom: string;
}

export interface WordSelectedGameEventProps extends CustomSocket {
  idRoom: string;
  wordSelected: string;
}

export interface CanvasImageGameEventProps extends CustomSocket {
  idRoom: string;
  dataUrl: string;
}

export interface CanvasClearGameEventProps extends CustomSocket {
  idRoom: string;
}

export interface CountdownGameEventProps extends CustomSocket {
  idRoom: string;
}

export interface SendMessageGameEventProps extends CustomSocket {
  idRoom: string;
  message: string;
}

export interface NewPainterGameEventProps extends CustomSocket {
  idRoom: string;
}

export interface NextRoundGameEventProps extends CustomSocket {
  idRoom: string;
}

export interface FinishGameEventProps extends CustomSocket {
  idRoom: string;
}
