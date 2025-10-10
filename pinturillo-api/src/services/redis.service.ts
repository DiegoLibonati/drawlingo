import { Lobby, Rooms, Users } from "@src/entities/app";

import { RedisDAO } from "@src/daos/redis.dao";

export const RedisService = {
  getUsers: async () => await RedisDAO.get<Users>("users"),
  getRooms: async () => await RedisDAO.get<Rooms>("rooms"),
  getLobby: async () => await RedisDAO.get<Lobby>("lobby"),
  setUsers: (users: Users) => RedisDAO.set("users", users),
  setRooms: (rooms: Rooms) => RedisDAO.set("rooms", rooms),
  setLobby: (lobby: Lobby) => RedisDAO.set("lobby", lobby),
};
