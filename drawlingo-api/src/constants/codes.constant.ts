import type { CodesError, CodesNot, CodesSuccess } from "@/types/constants";

export const CODES_SUCCESS: CodesSuccess = {
  userConnected: "USER_CONNECTED",
  lobbyJoined: "LOBBY_JOINED",
  lobbyLeft: "LOBBY_LEFT",
  lobbyMessageSent: "LOBBY_MESSAGE_SENT",
  roomCreated: "ROOM_CREATED",
  roomJoined: "ROOM_JOINED",
  roomPrivateLogin: "ROOM_PRIVATE_LOGIN",
  gameStarted: "GAME_STARTED",
  gameJoined: "GAME_JOINED",
  wordSelected: "WORD_SELECTED",
  canvasImageSent: "CANVAS_IMAGE_SENT",
  canvasCleared: "CANVAS_CLEARED",
  countdownUpdated: "COUNTDOWN_UPDATED",
  gameMessageSent: "GAME_MESSAGE_SENT",
  newPainterSet: "NEW_PAINTER_SET",
  nextRoundStarted: "NEXT_ROUND_STARTED",
  gameFinished: "GAME_FINISHED",
  healthLive: "SUCCESS_HEALTH_LIVE",
  healthReady: "SUCCESS_HEALTH_READY",
};

export const CODES_ERROR: CodesError = {
  generic: "ERROR_GENERIC",
  redis: "ERROR_REDIS",
  validation: "ERROR_VALIDATION",
};

export const CODES_NOT: CodesNot = {
  foundRoute: "NOT_FOUND_ROUTE",
};
