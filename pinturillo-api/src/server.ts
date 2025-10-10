import http from "http";

import { envs } from "@src/configs/env.config";

import app from "@src/app";
import { initSockets } from "@src/sockets";

import { initRedis } from "@src/configs/redis.config";

import { RedisService } from "@src/services/redis.service";

import {
  INITIAL_LOBBY,
  INITIAL_ROOMS,
  INITIAL_USERS,
} from "@src/constants/vars";

const server = http.createServer(app);
const PORT = envs.PORT;
const ENV = envs.ENV;
const BASE_URL = envs.BASE_URL;

initSockets(server);

const onInit = async () => {
  const baseUrl = ENV === "development" ? `http://localhost:${PORT}` : BASE_URL;

  console.log(`🚀 Server running in ${ENV} mode on ${baseUrl}`);

  initRedis();

  RedisService.setUsers(INITIAL_USERS);
  RedisService.setRooms(INITIAL_ROOMS);
  RedisService.setLobby(INITIAL_LOBBY);

  const users = await RedisService.getUsers();
  const rooms = await RedisService.getRooms();
  const lobby = await RedisService.getLobby();

  console.log("Users Restarted", users);
  console.log("Rooms Restarted", rooms);
  console.log("Lobby Restarted", lobby);
};

server.listen(PORT, onInit);
