import { setActivePinia, createPinia } from "pinia";

import type { Lobby } from "@/types/app";

import { useLobbyStore } from "@/stores/useLobbyStore";

describe("useLobbyStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe("state", () => {
    it("should have id as lobby_room initially", () => {
      const store = useLobbyStore();

      expect(store.id).toBe("lobby_room");
    });

    it("should have empty rooms initially", () => {
      const store = useLobbyStore();

      expect(store.rooms).toEqual({});
    });

    it("should have empty users array initially", () => {
      const store = useLobbyStore();

      expect(store.users).toEqual([]);
    });

    it("should have appTotalPlayers as 0 initially", () => {
      const store = useLobbyStore();

      expect(store.appTotalPlayers).toBe(0);
    });
  });

  describe("getters", () => {
    it("should return 0 for roomsLength when rooms is empty", () => {
      const store = useLobbyStore();

      expect(store.roomsLength).toBe(0);
    });

    it("should return correct roomsLength when rooms are set", () => {
      const store = useLobbyStore();
      const lobby: Lobby = {
        id: "lobby_room",
        rooms: {
          room1: {
            id: "room1",
            configuration: {
              name: "Room 1",
              password: "",
              rounds: { actualRound: 1, totalRounds: 1 },
              slots: 6,
              type: "public",
              countdown: { countdownSelected: 90, countdownGame: 90 },
            },
            owner: { id: "u1", username: "owner", actualRoom: "room1" },
            players: [],
            started: false,
            wordToGuess: { actualWord: "", wordsToChoose: [], wordWithPlaceholder: "" },
          },
          room2: {
            id: "room2",
            configuration: {
              name: "Room 2",
              password: "",
              rounds: { actualRound: 1, totalRounds: 1 },
              slots: 6,
              type: "public",
              countdown: { countdownSelected: 90, countdownGame: 90 },
            },
            owner: { id: "u2", username: "owner2", actualRoom: "room2" },
            players: [],
            started: false,
            wordToGuess: { actualWord: "", wordsToChoose: [], wordWithPlaceholder: "" },
          },
        },
        users: [],
        appTotalPlayers: 0,
      };

      store.setLobby(lobby);

      expect(store.roomsLength).toBe(2);
    });

    it("should return 0 for usersOnInLobby when users is empty", () => {
      const store = useLobbyStore();

      expect(store.usersOnInLobby).toBe(0);
    });

    it("should return correct usersOnInLobby when users are set", () => {
      const store = useLobbyStore();
      const lobby: Lobby = {
        id: "lobby_room",
        rooms: {},
        users: [
          { id: "u1", username: "user1", actualRoom: "lobby_room" },
          { id: "u2", username: "user2", actualRoom: "lobby_room" },
          { id: "u3", username: "user3", actualRoom: "lobby_room" },
        ],
        appTotalPlayers: 3,
      };

      store.setLobby(lobby);

      expect(store.usersOnInLobby).toBe(3);
    });
  });

  describe("actions", () => {
    it("should set lobby state with setLobby", () => {
      const store = useLobbyStore();
      const lobby: Lobby = {
        id: "lobby_room",
        rooms: {},
        users: [{ id: "u1", username: "player1", actualRoom: "lobby_room" }],
        appTotalPlayers: 10,
      };

      store.setLobby(lobby);

      expect(store.id).toBe("lobby_room");
      expect(store.users).toHaveLength(1);
      expect(store.users[0].username).toBe("player1");
      expect(store.appTotalPlayers).toBe(10);
    });
  });
});
