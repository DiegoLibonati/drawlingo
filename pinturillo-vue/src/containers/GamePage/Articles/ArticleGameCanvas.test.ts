import { shallowMount } from "@vue/test-utils";

import { createPinia, setActivePinia } from "pinia";

import ArticleGameCanvas from "@/containers/GamePage/Articles/ArticleGameCanvas.vue";

import { useUserStore } from "@/stores/user/user";
import { useRoomStore } from "@/stores/room/room";

jest.mock("@/stores/user/user", () => ({
  useUserStore: jest.fn(),
}));
jest.mock("@/stores/room/room", () => ({
  useRoomStore: jest.fn(),
}));

describe("ArticleGameCanvas.vue", () => {
  let pinia: ReturnType<typeof createPinia>;

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);
  });

  describe("If actualWord is true.", () => {
    const idUser = "user_123";

    const wordToGuess = {
      actualWord: "asd",
      wordWithPlaceholder: "_ _ _",
    };

    beforeEach(() => {
      const userStoreMock = {
        id: idUser,
      } as unknown as jest.Mocked<ReturnType<typeof useUserStore>>;

      (useUserStore as unknown as jest.Mock).mockReturnValue(userStoreMock);

      const roomStoreMock = {
        wordToGuess: wordToGuess,
      } as unknown as jest.Mocked<ReturnType<typeof useRoomStore>>;

      (useRoomStore as unknown as jest.Mock).mockReturnValue(roomStoreMock);
    });

    test("It must render the board canvas.", async () => {
      const wrapper = shallowMount(ArticleGameCanvas);

      const boardCanvas = wrapper.find("board-canvas-stub");

      expect(wrapper.exists()).toBe(true);
      expect(boardCanvas.exists()).toBe(true);
    });
  });

  describe("If actualWord is false and playerChoosingWord is not equal to user session.", () => {
    const idUser = "user_123";

    const playerChoosingWord = {
      id: "a1",
      username: "a",
      actualRoom: "a2",
      isPaiting: false,
      alreadyPainted: false,
      choosingAWord: false,
      score: 10,
      guessed: false,
    };
    const wordToGuess = {
      actualWord: "",
      wordWithPlaceholder: "_ _ _",
    };

    beforeEach(() => {
      const userStoreMock = {
        id: idUser,
      } as unknown as jest.Mocked<ReturnType<typeof useUserStore>>;

      (useUserStore as unknown as jest.Mock).mockReturnValue(userStoreMock);

      const roomStoreMock = {
        wordToGuess: wordToGuess,
        playerChoosingWord: playerChoosingWord,
      } as unknown as jest.Mocked<ReturnType<typeof useRoomStore>>;

      (useRoomStore as unknown as jest.Mock).mockReturnValue(roomStoreMock);
    });

    test("It must render the board selecting word.", async () => {
      const wrapper = shallowMount(ArticleGameCanvas);

      console.log(wrapper.html());

      const boardSelectionWord = wrapper.find("board-selecting-word-stub");

      expect(wrapper.exists()).toBe(true);
      expect(boardSelectionWord.exists()).toBe(true);
    });
  });

  describe("If actualWord is false and playerChoosingWord is equal to user session.", () => {
    const idUser = "user_123";

    const playerChoosingWord = {
      id: idUser,
      username: "a",
      actualRoom: "a2",
      isPaiting: false,
      alreadyPainted: false,
      choosingAWord: false,
      score: 10,
      guessed: false,
    };
    const wordToGuess = {
      actualWord: "",
      wordWithPlaceholder: "_ _ _",
    };

    beforeEach(() => {
      const userStoreMock = {
        id: idUser,
      } as unknown as jest.Mocked<ReturnType<typeof useUserStore>>;

      (useUserStore as unknown as jest.Mock).mockReturnValue(userStoreMock);

      const roomStoreMock = {
        wordToGuess: wordToGuess,
        playerChoosingWord: playerChoosingWord,
      } as unknown as jest.Mocked<ReturnType<typeof useRoomStore>>;

      (useRoomStore as unknown as jest.Mock).mockReturnValue(roomStoreMock);
    });

    test("It must render the board select word.", async () => {
      const wrapper = shallowMount(ArticleGameCanvas);

      const boardSelectionWord = wrapper.find("board-select-word-stub");

      expect(wrapper.exists()).toBe(true);
      expect(boardSelectionWord.exists()).toBe(true);
    });
  });
});
