import type { MessagesSuccess, MessagesError, MessagesNot } from "@/types/constants";

export const MESSAGES_SUCCESS: MessagesSuccess = {
  userConnected: "Connected successfully.",
  lobbyJoined: "Joined lobby successfully.",
  lobbyLeft: "Left lobby successfully.",
  lobbyMessageSent: "Message sent.",
  roomCreated: "Room created successfully.",
  roomJoined: "Joined room successfully.",
  roomPrivateLogin: "Logged into private room.",
  gameStarted: "Game started.",
  gameJoined: "Game joined.",
  wordSelected: "Word selected.",
  canvasImageSent: "Canvas image sent.",
  canvasCleared: "Canvas cleared.",
  countdownUpdated: "Countdown updated.",
  gameMessageSent: "Message sent.",
  newPainterSet: "New painter set.",
  nextRoundStarted: "Next round started.",
  gameFinished: "Game finished.",
  healthLive: "Service is alive.",
  healthReady: "Service is ready.",
};

export const MESSAGES_NOT: MessagesNot = {
  foundRoute: "Route not found.",
};

export const MESSAGES_ERROR: MessagesError = {
  generic: "Something went wrong!",
  redis: "Something went wrong with Redis!",
  validation: "Validation failed.",
  userAlreadyConnected: "User already connected.",
  roomOwnerLeft: "The owner of the room left",
  gameLackOfPlayers: "Game terminated due to lack of players",
  roomNotFound: "There is no room with the entered ID.",
  roomNotPrivate: "The room you want to connect to is public, not private.",
  roomPasswordIncorrect: "The password entered is incorrect.",
};
