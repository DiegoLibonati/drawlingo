export interface MessagesSuccess {
  userConnected: string;
  lobbyJoined: string;
  lobbyLeft: string;
  lobbyMessageSent: string;
  roomCreated: string;
  roomJoined: string;
  roomPrivateLogin: string;
  gameStarted: string;
  gameJoined: string;
  wordSelected: string;
  canvasImageSent: string;
  canvasCleared: string;
  countdownUpdated: string;
  gameMessageSent: string;
  newPainterSet: string;
  nextRoundStarted: string;
  gameFinished: string;
  healthLive: string;
  healthReady: string;
}

export interface MessagesNot {
  foundRoute: string;
}

export interface MessagesError {
  generic: string;
  redis: string;
  validation: string;
  userAlreadyConnected: string;
  roomOwnerLeft: string;
  gameLackOfPlayers: string;
  roomNotFound: string;
  roomNotPrivate: string;
  roomPasswordIncorrect: string;
}

export interface CodesSuccess {
  userConnected: "USER_CONNECTED";
  lobbyJoined: "LOBBY_JOINED";
  lobbyLeft: "LOBBY_LEFT";
  lobbyMessageSent: "LOBBY_MESSAGE_SENT";
  roomCreated: "ROOM_CREATED";
  roomJoined: "ROOM_JOINED";
  roomPrivateLogin: "ROOM_PRIVATE_LOGIN";
  gameStarted: "GAME_STARTED";
  gameJoined: "GAME_JOINED";
  wordSelected: "WORD_SELECTED";
  canvasImageSent: "CANVAS_IMAGE_SENT";
  canvasCleared: "CANVAS_CLEARED";
  countdownUpdated: "COUNTDOWN_UPDATED";
  gameMessageSent: "GAME_MESSAGE_SENT";
  newPainterSet: "NEW_PAINTER_SET";
  nextRoundStarted: "NEXT_ROUND_STARTED";
  gameFinished: "GAME_FINISHED";
  healthLive: "SUCCESS_HEALTH_LIVE";
  healthReady: "SUCCESS_HEALTH_READY";
}

export interface CodesNot {
  foundRoute: "NOT_FOUND_ROUTE";
}

export interface CodesError {
  generic: "ERROR_GENERIC";
  redis: "ERROR_REDIS";
  validation: "ERROR_VALIDATION";
}
