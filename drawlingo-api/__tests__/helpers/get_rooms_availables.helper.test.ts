import type { Player, Room, Rooms } from "@/types/app";

import { getRoomsAvailables } from "@/helpers/get_rooms_availables.helper";

const buildPlayer = (id: string): Player => ({
  id,
  username: `user-${id}`,
  actualRoom: "room-1",
  score: 0,
  isPainting: false,
  choosingAWord: false,
  alreadyPainted: false,
  guessed: false,
});

const buildRoom = (overrides: Partial<Room> = {}): Room => ({
  id: "room-1",
  configuration: {
    name: "Room 1",
    slots: 6,
    type: "public",
    password: "",
    rounds: { totalRounds: 3, actualRound: 1 },
    countdown: { countdownGame: 60, countdownSelected: 60 },
  },
  players: [],
  started: false,
  owner: { id: "user-1", username: "owner", actualRoom: "room-1" },
  wordToGuess: { actualWord: "", wordsToChoose: [], wordWithPlaceholder: "" },
  ...overrides,
});

describe("get_rooms_availables.helper", () => {
  describe("getRoomsAvailables", () => {
    it("should return rooms that are not full and not started", () => {
      const rooms: Rooms = { "room-1": buildRoom() };

      const result: Rooms = getRoomsAvailables(rooms);

      expect(Object.keys(result)).toHaveLength(1);
      expect(result["room-1"]).toBeDefined();
    });

    it("should exclude rooms that are full", () => {
      const fullRoom: Room = buildRoom({
        id: "room-full",
        players: Array.from({ length: 6 }, (_, i: number) => buildPlayer(`p${i}`)),
      });
      const rooms: Rooms = { "room-full": fullRoom };

      const result: Rooms = getRoomsAvailables(rooms);

      expect(Object.keys(result)).toHaveLength(0);
    });

    it("should exclude rooms that have started", () => {
      const rooms: Rooms = { "room-1": buildRoom({ started: true }) };

      const result: Rooms = getRoomsAvailables(rooms);

      expect(Object.keys(result)).toHaveLength(0);
    });

    it("should return empty object when no rooms exist", () => {
      const result: Rooms = getRoomsAvailables({});

      expect(result).toEqual({});
    });

    it("should filter mixed rooms correctly", () => {
      const rooms: Rooms = {
        available: buildRoom({ id: "available" }),
        started: buildRoom({ id: "started", started: true }),
        full: buildRoom({
          id: "full",
          players: Array.from({ length: 6 }, (_, i: number) => buildPlayer(`p${i}`)),
        }),
      };

      const result: Rooms = getRoomsAvailables(rooms);

      expect(Object.keys(result)).toEqual(["available"]);
    });
  });
});
