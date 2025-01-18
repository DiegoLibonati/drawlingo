import { Rooms } from "@src/entities/entities";

import { getRoomsAvailables } from "@src/helpers/getRoomsAvailables";

describe("getRoomsAvailables.ts", () => {
  describe("General Tests.", () => {
    test("it should return all rooms when all are available.", () => {
      const rooms: Rooms = {
        room1: {
          id: "a",
          configuration: {
            countdown: {
              countdownGame: 90,
              countdownSelected: 90,
            },
            name: "asda",
            password: "",
            rounds: {
              actualRound: 1,
              totalRounds: 3,
            },
            slots: 6,
            type: "public",
          },
          owner: { id: "123", actualRoom: "room1", username: "asd" },
          players: [],
          started: false,
          wordToGuess: {
            actualWord: "123",
            wordsToChoose: ["asd", "asd"],
            wordWithPlaceholder: "3123",
          },
        },
        room2: {
          id: "a2",
          configuration: {
            countdown: {
              countdownGame: 90,
              countdownSelected: 90,
            },
            name: "asda",
            password: "",
            rounds: {
              actualRound: 1,
              totalRounds: 3,
            },
            slots: 6,
            type: "public",
          },
          owner: { id: "1223", actualRoom: "room1", username: "asd" },
          players: [],
          started: false,
          wordToGuess: {
            actualWord: "1232",
            wordsToChoose: ["asd", "asd"],
            wordWithPlaceholder: "3123",
          },
        },
      };

      const result = getRoomsAvailables(rooms);
      expect(result).toEqual(rooms);
    });

    test("It should return only available rooms when some are not available.", () => {
      const rooms: Rooms = {
        room1: {
          id: "a",
          configuration: {
            countdown: {
              countdownGame: 90,
              countdownSelected: 90,
            },
            name: "asda",
            password: "",
            rounds: {
              actualRound: 1,
              totalRounds: 3,
            },
            slots: 6,
            type: "public",
          },
          owner: { id: "123", actualRoom: "room1", username: "asd" },
          players: [],
          started: true,
          wordToGuess: {
            actualWord: "123",
            wordsToChoose: ["asd", "asd"],
            wordWithPlaceholder: "3123",
          },
        },
        asd: {
          id: "a3",
          configuration: {
            countdown: {
              countdownGame: 90,
              countdownSelected: 90,
            },
            name: "asda",
            password: "",
            rounds: {
              actualRound: 1,
              totalRounds: 3,
            },
            slots: 6,
            type: "public",
          },
          owner: { id: "123", actualRoom: "room1", username: "asd" },
          players: [],
          started: false,
          wordToGuess: {
            actualWord: "123",
            wordsToChoose: ["asd", "asd"],
            wordWithPlaceholder: "3123",
          },
        },
        room2: {
          id: "a2",
          configuration: {
            countdown: {
              countdownGame: 90,
              countdownSelected: 90,
            },
            name: "asda",
            password: "",
            rounds: {
              actualRound: 1,
              totalRounds: 3,
            },
            slots: 6,
            type: "public",
          },
          owner: { id: "1223", actualRoom: "room1", username: "asd" },
          players: [
            {
              id: "1",
              actualRoom: "asd",
              alreadyPainted: false,
              choosingAWord: false,
              guessed: false,
              isPaiting: false,
              score: 2,
              username: "123",
            },
            {
              id: "12",
              actualRoom: "asd",
              alreadyPainted: false,
              choosingAWord: false,
              guessed: false,
              isPaiting: false,
              score: 2,
              username: "123",
            },
            {
              id: "13",
              actualRoom: "asd",
              alreadyPainted: false,
              choosingAWord: false,
              guessed: false,
              isPaiting: false,
              score: 2,
              username: "123",
            },
            {
              id: "14",
              actualRoom: "asd",
              alreadyPainted: false,
              choosingAWord: false,
              guessed: false,
              isPaiting: false,
              score: 2,
              username: "123",
            },
            {
              id: "15",
              actualRoom: "asd",
              alreadyPainted: false,
              choosingAWord: false,
              guessed: false,
              isPaiting: false,
              score: 2,
              username: "123",
            },
            {
              id: "16",
              actualRoom: "asd",
              alreadyPainted: false,
              choosingAWord: false,
              guessed: false,
              isPaiting: false,
              score: 2,
              username: "123",
            },
          ],
          started: false,
          wordToGuess: {
            actualWord: "1232",
            wordsToChoose: ["asd", "asd"],
            wordWithPlaceholder: "3123",
          },
        },
      };

      const expected = {
        asd: {
          id: "a3",
          configuration: {
            countdown: {
              countdownGame: 90,
              countdownSelected: 90,
            },
            name: "asda",
            password: "",
            rounds: {
              actualRound: 1,
              totalRounds: 3,
            },
            slots: 6,
            type: "public",
          },
          owner: { id: "123", actualRoom: "room1", username: "asd" },
          players: [],
          started: false,
          wordToGuess: {
            actualWord: "123",
            wordsToChoose: ["asd", "asd"],
            wordWithPlaceholder: "3123",
          },
        },
      };

      const result = getRoomsAvailables(rooms);
      expect(result).toEqual(expected);
    });

    test("It should return an empty object when no rooms are available.", () => {
      const rooms: Rooms = {
        room1: {
          id: "a",
          configuration: {
            countdown: {
              countdownGame: 90,
              countdownSelected: 90,
            },
            name: "asda",
            password: "",
            rounds: {
              actualRound: 1,
              totalRounds: 3,
            },
            slots: 6,
            type: "public",
          },
          owner: { id: "123", actualRoom: "room1", username: "asd" },
          players: [],
          started: true,
          wordToGuess: {
            actualWord: "123",
            wordsToChoose: ["asd", "asd"],
            wordWithPlaceholder: "3123",
          },
        },
        room2: {
          id: "a2",
          configuration: {
            countdown: {
              countdownGame: 90,
              countdownSelected: 90,
            },
            name: "asda",
            password: "",
            rounds: {
              actualRound: 1,
              totalRounds: 3,
            },
            slots: 6,
            type: "public",
          },
          owner: { id: "1223", actualRoom: "room1", username: "asd" },
          players: [
            {
              id: "1",
              actualRoom: "asd",
              alreadyPainted: false,
              choosingAWord: false,
              guessed: false,
              isPaiting: false,
              score: 2,
              username: "123",
            },
            {
              id: "12",
              actualRoom: "asd",
              alreadyPainted: false,
              choosingAWord: false,
              guessed: false,
              isPaiting: false,
              score: 2,
              username: "123",
            },
            {
              id: "13",
              actualRoom: "asd",
              alreadyPainted: false,
              choosingAWord: false,
              guessed: false,
              isPaiting: false,
              score: 2,
              username: "123",
            },
            {
              id: "14",
              actualRoom: "asd",
              alreadyPainted: false,
              choosingAWord: false,
              guessed: false,
              isPaiting: false,
              score: 2,
              username: "123",
            },
            {
              id: "15",
              actualRoom: "asd",
              alreadyPainted: false,
              choosingAWord: false,
              guessed: false,
              isPaiting: false,
              score: 2,
              username: "123",
            },
            {
              id: "16",
              actualRoom: "asd",
              alreadyPainted: false,
              choosingAWord: false,
              guessed: false,
              isPaiting: false,
              score: 2,
              username: "123",
            },
          ],
          started: false,
          wordToGuess: {
            actualWord: "1232",
            wordsToChoose: ["asd", "asd"],
            wordWithPlaceholder: "3123",
          },
        },
      };

      const result = getRoomsAvailables(rooms);
      expect(result).toEqual({});
    });
  });
});
