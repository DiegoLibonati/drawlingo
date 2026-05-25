import type { Rooms } from "@/types/app";

export const getRoomsAvailables = (rooms: Rooms): Rooms => {
  return Object.fromEntries(
    Object.entries(rooms).filter(
      ([, value]) => value.players.length !== value.configuration.slots && !value.started
    )
  );
};
