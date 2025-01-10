import { CustomSocket, Rooms } from "@src/entities/entities";

import { getRedis } from "@src/redisClient";

interface FinishGameEventProps extends CustomSocket {
  idRoom: string;
}

export const finishGameEvent = async ({ idRoom }: FinishGameEventProps) => {
  const rooms = await getRedis<Rooms>("rooms");
  const room = rooms[idRoom];

  console.log("GAME TERMINADO", room.id);
  return;
};
