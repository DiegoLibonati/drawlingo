import {
  MessagesSuccess,
  MessagesError,
  MessagesNot,
} from "@src/entities/constants";

export const MESSAGES_SUCCESS: MessagesSuccess = {};

export const MESSAGES_NOT: MessagesNot = {
  foundRoute: "Route not found.",
};

export const MESSAGES_ERROR: MessagesError = {
  generic: "Something went wrong!",
  redis: "Something went wrong with Redis!",
};
