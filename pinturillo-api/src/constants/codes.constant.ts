import { CodesError, CodesNot, CodesSuccess } from "@src/entities/constants";

export const CODES_SUCCESS: CodesSuccess = {};

export const CODES_ERROR: CodesError = {
  generic: "ERROR_GENERIC",
  redis: "ERROR_REDIS",
};

export const CODES_NOT: CodesNot = {
  foundRoute: "NOT_FOUND_ROUTE",
};
