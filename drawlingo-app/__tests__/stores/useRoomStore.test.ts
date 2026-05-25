import { setActivePinia, createPinia } from "pinia";

import type { Player, Room } from "@/types/app";

import { useRoomStore } from "@/stores/useRoomStore";
import { useUserStore } from "@/stores/useUserStore";

const buildPlayer = (overrides: Partial<Player> = {}): Player => ({
  id: "p1",
  username: "player1",
  actualRoom: "room1",
  isPainting: false,
  alreadyPainted: false,
  choosingAWord: false,
  score: 0,
  guessed: false,
  ...overrides,
});

const buildRoom = (overrides: Partial<Room> = {}): Room => ({
  id: "room1",
  configuration: {
    name: "Test Room",
    password: "",
    rounds: { actualRound: 1, totalRounds: 1 },
    slots: 6,
    type: "public",
    countdown: { countdownSelected: 90, countdownGame: 90 },
  },
  owner: { id: "o1", username: "owner", actualRoom: "room1" },
  players: [],
  started: false,
  wordToGuess: { actualWord: "", wordsToChoose: [], wordWithPlaceholder: "" },
  ...overrides,
});

describe("useRoomStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe("state", () => {
    it("should have empty id initially", () => {
      const store = useRoomStore();

      expect(store.id).toBe("");
    });

    it("should have default configuration initially", () => {
      const store = useRoomStore();

      expect(store.configuration.name).toBe("");
      expect(store.configuration.password).toBe("");
      expect(store.configuration.rounds).toEqual({ actualRound: 1, totalRounds: 1 });
      expect(store.configuration.slots).toBe(6);
      expect(store.configuration.type).toBe("public");
      expect(store.configuration.countdown).toEqual({ countdownSelected: 90, countdownGame: 90 });
    });

    it("should have empty owner initially", () => {
      const store = useRoomStore();

      expect(store.owner).toEqual({ id: "", username: "", actualRoom: "" });
    });

    it("should have empty players array initially", () => {
      const store = useRoomStore();

      expect(store.players).toEqual([]);
    });

    it("should have started as false initially", () => {
      const store = useRoomStore();

      expect(store.started).toBe(false);
    });

    it("should have empty wordToGuess initially", () => {
      const store = useRoomStore();

      expect(store.wordToGuess).toEqual({
        actualWord: "",
        wordsToChoose: [],
        wordWithPlaceholder: "",
      });
    });
  });

  describe("getters", () => {
    it("should return 0 for playersLength when players is empty", () => {
      const store = useRoomStore();

      expect(store.playersLength).toBe(0);
    });

    it("should return correct playersLength when players are set", () => {
      const store = useRoomStore();
      store.setRoom(
        buildRoom({
          players: [buildPlayer({ id: "p1" }), buildPlayer({ id: "p2" })],
        })
      );

      expect(store.playersLength).toBe(2);
    });

    it("should return players ordered by score descending with orderPlayersByScore", () => {
      const store = useRoomStore();
      store.setRoom(
        buildRoom({
          players: [
            buildPlayer({ id: "p1", score: 10 }),
            buildPlayer({ id: "p2", score: 50 }),
            buildPlayer({ id: "p3", score: 30 }),
          ],
        })
      );

      const ordered = store.orderPlayersByScore;

      expect(ordered[0].id).toBe("p2");
      expect(ordered[1].id).toBe("p3");
      expect(ordered[2].id).toBe("p1");
    });

    it("should return the player choosing a word with playerChoosingWord", () => {
      const store = useRoomStore();
      store.setRoom(
        buildRoom({
          players: [
            buildPlayer({ id: "p1", choosingAWord: false }),
            buildPlayer({ id: "p2", choosingAWord: true }),
          ],
        })
      );

      const choosing = store.playerChoosingWord;

      expect(choosing).not.toBeNull();
      expect(choosing!.id).toBe("p2");
    });

    it("should return null for playerChoosingWord when no player is choosing", () => {
      const store = useRoomStore();
      store.setRoom(
        buildRoom({
          players: [buildPlayer({ id: "p1", choosingAWord: false })],
        })
      );

      expect(store.playerChoosingWord).toBeNull();
    });

    it("should return the player painting with playerPaitingWord", () => {
      const store = useRoomStore();
      store.setRoom(
        buildRoom({
          players: [
            buildPlayer({ id: "p1", isPainting: false }),
            buildPlayer({ id: "p2", isPainting: true }),
          ],
        })
      );

      const painting = store.playerPaitingWord;

      expect(painting).not.toBeNull();
      expect(painting!.id).toBe("p2");
    });

    it("should return null for playerPaitingWord when no player is painting", () => {
      const store = useRoomStore();
      store.setRoom(
        buildRoom({
          players: [buildPlayer({ id: "p1", isPainting: false })],
        })
      );

      expect(store.playerPaitingWord).toBeNull();
    });

    it("should return the current player who guessed with currentPlayerGuessed", () => {
      const userStore = useUserStore();
      userStore.login({ id: "p2", username: "me", actualRoom: "room1" });
      const store = useRoomStore();
      store.setRoom(
        buildRoom({
          players: [
            buildPlayer({ id: "p1", guessed: true }),
            buildPlayer({ id: "p2", guessed: true }),
          ],
        })
      );

      const guessed = store.currentPlayerGuessed;

      expect(guessed).not.toBeNull();
      expect(guessed!.id).toBe("p2");
    });

    it("should return null for currentPlayerGuessed when current player has not guessed", () => {
      const userStore = useUserStore();
      userStore.login({ id: "p2", username: "me", actualRoom: "room1" });
      const store = useRoomStore();
      store.setRoom(
        buildRoom({
          players: [
            buildPlayer({ id: "p1", guessed: true }),
            buildPlayer({ id: "p2", guessed: false }),
          ],
        })
      );

      expect(store.currentPlayerGuessed).toBeNull();
    });

    it("should return null for currentPlayerGuessed when current player is not in room", () => {
      const userStore = useUserStore();
      userStore.login({ id: "p99", username: "me", actualRoom: "room1" });
      const store = useRoomStore();
      store.setRoom(
        buildRoom({
          players: [buildPlayer({ id: "p1", guessed: true })],
        })
      );

      expect(store.currentPlayerGuessed).toBeNull();
    });

    it("should return countdownGame from configuration", () => {
      const store = useRoomStore();
      store.setRoom(
        buildRoom({
          configuration: {
            name: "R",
            password: "",
            rounds: { actualRound: 1, totalRounds: 1 },
            slots: 6,
            type: "public",
            countdown: { countdownSelected: 90, countdownGame: 45 },
          },
        })
      );

      expect(store.countdownGame).toBe(45);
    });

    it("should return countdownSelected from configuration", () => {
      const store = useRoomStore();
      store.setRoom(
        buildRoom({
          configuration: {
            name: "R",
            password: "",
            rounds: { actualRound: 1, totalRounds: 1 },
            slots: 6,
            type: "public",
            countdown: { countdownSelected: 60, countdownGame: 60 },
          },
        })
      );

      expect(store.countdownSelected).toBe(60);
    });
  });

  describe("actions", () => {
    it("should set room state with setRoom", () => {
      const store = useRoomStore();
      const room = buildRoom({
        id: "room-abc",
        started: true,
        players: [buildPlayer({ id: "p1", score: 100 })],
      });

      store.setRoom(room);

      expect(store.id).toBe("room-abc");
      expect(store.started).toBe(true);
      expect(store.players).toHaveLength(1);
      expect(store.players[0].score).toBe(100);
    });
  });
});
