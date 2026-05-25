import type { Ack, AckResponse } from "@/types/responses";

export const safeAck =
  <T>(ack: Ack<T> | undefined): Ack<T> =>
  (response: AckResponse<T>) => {
    if (typeof ack === "function") ack(response);
  };
