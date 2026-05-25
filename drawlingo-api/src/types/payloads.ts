export interface ConnectPayload {
  username: string;
  pathToRedirect: string;
}

export interface LoginPrivateRoomPayload {
  idRoom: string;
  password: string;
}

export interface WordSelectedPayload {
  idRoom: string;
  wordSelected: string;
}

export interface CanvasImagePayload {
  idRoom: string;
  dataUrl: string;
}

export interface SendMessageGamePayload {
  idRoom: string;
  message: string;
}
