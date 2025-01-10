import { shallowMount } from "@vue/test-utils";

import { createPinia, setActivePinia } from "pinia";

import BoardCanvas from "@/components/Board/BoardCanvas/BoardCanvas.vue";

import { useRoomStore } from "@/stores/room/room";
import { useUserStore } from "@/stores/user/user";

jest.mock("@/stores/room/room", () => ({
  useRoomStore: jest.fn(),
}));
jest.mock("@/stores/user/user", () => ({
  useUserStore: jest.fn(),
}));

describe("BoardCanvas.vue", () => {
  let pinia: ReturnType<typeof createPinia>;

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);
  });

  describe("General Tests.", () => {
    const currentPlayerGuessed = {
      id: "a1",
      username: "a",
      actualRoom: "a2",
      isPaiting: false,
      alreadyPainted: false,
      choosingAWord: false,
      score: 10,
      guessed: false,
    }
    const wordToGuess = {
      actualWord: "asd",
      wordWithPlaceholder: "_ _ _",
    }
    const countdownGame = 50

    beforeEach(() => {
      const roomStoreMock = {
        currentPlayerGuessed: currentPlayerGuessed,
        wordToGuess: wordToGuess,
        countdownGame: countdownGame,
      } as unknown as jest.Mocked<ReturnType<typeof useRoomStore>>;

      (useRoomStore as unknown as jest.Mock).mockReturnValue(roomStoreMock);
    });

    test("It must render the countdown.", () => {
      const wrapper = shallowMount(BoardCanvas, {
        global: {
          plugins: [pinia],
        },
      });

      const countdown = wrapper.find("h3");
      const countdownText = countdown.text();

      expect(countdown).toBeTruthy();
      expect(countdownText).toEqual(String(countdownGame));
    });

    test("It must render the canvas.", () => {
      const wrapper = shallowMount(BoardCanvas, {
        global: {
          plugins: [pinia],
        },
      });

      const canvas = wrapper.find("canvas");

      expect(canvas).toBeTruthy();
    });
  });

  describe("If user guesses.", () => {
    const currentPlayerGuessed = {
      id: "a1",
      username: "a",
      actualRoom: "a2",
      isPaiting: false,
      alreadyPainted: false,
      choosingAWord: false,
      score: 10,
      guessed: true,
    }
    const wordToGuess = {
      actualWord: "asd",
      wordWithPlaceholder: "_ _ _",
    }

    beforeEach(() => {
      const roomStoreMock = {
        currentPlayerGuessed: currentPlayerGuessed,
        wordToGuess: wordToGuess,
      } as unknown as jest.Mocked<ReturnType<typeof useRoomStore>>;

      (useRoomStore as unknown as jest.Mock).mockReturnValue(roomStoreMock);
    });

    test("It should render the word container in green.", async () => {
      const wrapper = shallowMount(BoardCanvas, {
        global: {
          plugins: [pinia],
        },
      });

      const wordContainer = wrapper.find("[data-testid='word-container']");
      const wordContainerClasses = wordContainer.classes();

      expect(wordContainerClasses).toContain("bg-green-400");
    });

    test("It must render the complete word.", () => {
      const wrapper = shallowMount(BoardCanvas, {
        global: {
          plugins: [pinia],
        },
      });

      const word = wrapper.find("h2");
      const wordText = word.text();

      expect(word).toBeTruthy();
      expect(wordText).toEqual(wordToGuess.actualWord);
    });
  });

  describe("If user not guesses.", () => {
    const currentPlayerGuessed = null
    const wordToGuess = {
      actualWord: "asd",
      wordWithPlaceholder: "_ _ _",
    }

    beforeEach(() => {
      const roomStoreMock = {
        currentPlayerGuessed: currentPlayerGuessed,
        wordToGuess: wordToGuess,
      } as unknown as jest.Mocked<ReturnType<typeof useRoomStore>>;

      (useRoomStore as unknown as jest.Mock).mockReturnValue(roomStoreMock);
    });

    test("It should render the word container not in green.", async () => {
      const wrapper = shallowMount(BoardCanvas, {
        global: {
          plugins: [pinia],
        },
      });

      const wordContainer = wrapper.find("[data-testid='word-container']");
      const wordContainerClasses = wordContainer.classes();

      expect(wordContainerClasses).toContain("bg-secondary");
    });

    test("It must render the word with placeholders.", async () => {
      const wrapper = shallowMount(BoardCanvas, {
        global: {
          plugins: [pinia],
        },
      });

      const word = wrapper.find("h2");
      const wordText = word.text();

      expect(word).toBeTruthy();
      expect(wordText).toEqual(wordToGuess.wordWithPlaceholder);
    });
  });

  describe("If the user of the session is the painter.", () => {
    const idUser = "a1"

    const playerPaitingWord = {
      id: idUser,
      username: "a",
      actualRoom: "a2",
      isPaiting: false,
      alreadyPainted: false,
      choosingAWord: false,
      score: 10,
      guessed: false,
    }
    const wordToGuess = {
      actualWord: "asd",
      wordWithPlaceholder: "_ _ _",
    }

    beforeEach(() => {
      const userStoreMock = {
        id: idUser
      } as unknown as jest.Mocked<ReturnType<typeof useUserStore>>;

      (useUserStore as unknown as jest.Mock).mockReturnValue(userStoreMock);

      const roomStoreMock = {
        playerPaitingWord: playerPaitingWord,
        wordToGuess: wordToGuess,
      } as unknown as jest.Mocked<ReturnType<typeof useRoomStore>>;

      (useRoomStore as unknown as jest.Mock).mockReturnValue(roomStoreMock);
    });

    test("It must render the complete word.", () => {
      const wrapper = shallowMount(BoardCanvas, {
        global: {
          plugins: [pinia],
        },
      });

      const word = wrapper.find("h2");
      const wordText = word.text();

      expect(word).toBeTruthy();
      expect(wordText).toEqual(wordToGuess.actualWord);
    });

    test("It must render the tool bar to be able to paint.", () => {
      const wrapper = shallowMount(BoardCanvas, {
        global: {
          plugins: [pinia],
        },
      });

      const toolBar = wrapper.find("board-tool-bar-stub");

      expect(toolBar.exists()).toBe(true);
    });
  });

  describe("If the user is not the one who is painting.", () => {
    const idUser = "a1"

    const playerPaitingWord = {
      id: "pepe",
      username: "a",
      actualRoom: "a2",
      isPaiting: false,
      alreadyPainted: false,
      choosingAWord: false,
      score: 10,
      guessed: false,
    }
    const wordToGuess = {
      actualWord: "asd",
      wordWithPlaceholder: "_ _ _",
    }

    beforeEach(() => {
      const userStoreMock = {
        id: idUser,
      } as unknown as jest.Mocked<ReturnType<typeof useUserStore>>;

      (useUserStore as unknown as jest.Mock).mockReturnValue(userStoreMock);

      const roomStoreMock = {
        playerPaitingWord: playerPaitingWord,
        wordToGuess: wordToGuess,
      } as unknown as jest.Mocked<ReturnType<typeof useRoomStore>>;

      (useRoomStore as unknown as jest.Mock).mockReturnValue(roomStoreMock);
    });

    test("It should not render the board for painting.", () => {
      const wrapper = shallowMount(BoardCanvas, {
        global: {
          plugins: [pinia],
        },
      });

      const toolBar = wrapper.find("board-tool-bar-stub");

      expect(toolBar.exists()).toBe(false);
    });
  });
});
