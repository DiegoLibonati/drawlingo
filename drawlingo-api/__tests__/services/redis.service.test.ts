import type { Lobby, Rooms, Users } from "@/types/app";

import { RedisService } from "@/services/redis.service";

import { RedisDAO } from "@/daos/redis.dao";

const mockedRedisDAO = RedisDAO as jest.Mocked<typeof RedisDAO>;

jest.mock("@/daos/redis.dao");

describe("redis.service", () => {
  describe("getUsers", () => {
    it("should delegate to RedisDAO.getValue with key users", async () => {
      const usersJson: string = JSON.stringify({ "socket-1": { id: "socket-1", username: "u" } });
      mockedRedisDAO.getValue.mockResolvedValue(usersJson);

      const result: string | null = await RedisService.getUsers();

      expect(mockedRedisDAO.getValue).toHaveBeenCalledWith("users");
      expect(result).toBe(usersJson);
    });

    it("should return null when no users exist", async () => {
      mockedRedisDAO.getValue.mockResolvedValue(null);

      const result: string | null = await RedisService.getUsers();

      expect(result).toBeNull();
    });
  });

  describe("getRooms", () => {
    it("should delegate to RedisDAO.getValue with key rooms", async () => {
      mockedRedisDAO.getValue.mockResolvedValue("{}");

      const result: string | null = await RedisService.getRooms();

      expect(mockedRedisDAO.getValue).toHaveBeenCalledWith("rooms");
      expect(result).toBe("{}");
    });
  });

  describe("getLobby", () => {
    it("should delegate to RedisDAO.getValue with key lobby", async () => {
      mockedRedisDAO.getValue.mockResolvedValue("{}");

      const result: string | null = await RedisService.getLobby();

      expect(mockedRedisDAO.getValue).toHaveBeenCalledWith("lobby");
      expect(result).toBe("{}");
    });
  });

  describe("setUsers", () => {
    it("should serialize users and delegate to RedisDAO.setValue", async () => {
      const users: Users = { s1: { id: "s1", username: "u1", actualRoom: "" } };
      mockedRedisDAO.setValue.mockResolvedValue("OK");

      const result: string | null = await RedisService.setUsers(users);

      expect(mockedRedisDAO.setValue).toHaveBeenCalledWith("users", JSON.stringify(users));
      expect(result).toBe("OK");
    });
  });

  describe("setRooms", () => {
    it("should serialize rooms and delegate to RedisDAO.setValue", async () => {
      const rooms: Rooms = {};
      mockedRedisDAO.setValue.mockResolvedValue("OK");

      const result: string | null = await RedisService.setRooms(rooms);

      expect(mockedRedisDAO.setValue).toHaveBeenCalledWith("rooms", JSON.stringify(rooms));
      expect(result).toBe("OK");
    });
  });

  describe("setLobby", () => {
    it("should serialize lobby and delegate to RedisDAO.setValue", async () => {
      const lobby: Lobby = {
        id: "lobby_room",
        rooms: {},
        appTotalPlayers: 0,
        users: [],
      };
      mockedRedisDAO.setValue.mockResolvedValue("OK");

      const result: string | null = await RedisService.setLobby(lobby);

      expect(mockedRedisDAO.setValue).toHaveBeenCalledWith("lobby", JSON.stringify(lobby));
      expect(result).toBe("OK");
    });
  });
});
