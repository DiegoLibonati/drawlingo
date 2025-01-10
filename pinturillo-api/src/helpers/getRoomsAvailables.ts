import { Rooms } from "@src/entities/entities";

export const getRoomsAvailables = (rooms: Rooms): Rooms => {
  const roomsAvailables = Object.fromEntries(
    Object.entries(rooms).filter(
      ([_, value]) =>
        value.players.length !== value.configuration.slots && !value.started
    )
  );

  return roomsAvailables;
};
