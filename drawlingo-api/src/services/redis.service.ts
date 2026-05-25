import type { Lobby, Rooms, Users } from "@/types/app";

import { RedisDAO } from "@/daos/redis.dao";

export const RedisService = {
  getUsers: async (): Promise<string | null> => await RedisDAO.getValue("users"),
  getRooms: async (): Promise<string | null> => await RedisDAO.getValue("rooms"),
  getLobby: async (): Promise<string | null> => await RedisDAO.getValue("lobby"),
  setUsers: (users: Users): Promise<string | null> =>
    RedisDAO.setValue("users", JSON.stringify(users)),
  setRooms: (rooms: Rooms): Promise<string | null> =>
    RedisDAO.setValue("rooms", JSON.stringify(rooms)),
  setLobby: (lobby: Lobby): Promise<string | null> =>
    RedisDAO.setValue("lobby", JSON.stringify(lobby)),
};
