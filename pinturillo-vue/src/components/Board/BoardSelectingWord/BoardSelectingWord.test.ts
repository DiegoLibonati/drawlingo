import { shallowMount } from "@vue/test-utils";

import { createPinia, setActivePinia } from "pinia";

import BoardSelectingWord from "@src/components/Board/BoardSelectingWord/BoardSelectingWord.vue";

import { useRoomStore } from "@src/stores/room/room";

jest.mock("@src/stores/room/room", () => ({
  useRoomStore: jest.fn(),
}));

describe("BoardSelectingWord.vue", () => {
  let pinia: ReturnType<typeof createPinia>;

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);
  });

  describe("General Tests.", () => {
    const playerChoosingWord = {
      id: "a1",
      username: "a",
      actualRoom: "a2",
      isPainting: false,
      alreadyPainted: false,
      choosingAWord: false,
      score: 10,
      guessed: false,
    };

    beforeEach(() => {
      const roomStoreMock = {
        playerChoosingWord: playerChoosingWord,
      } as unknown as jest.Mocked<ReturnType<typeof useRoomStore>>;

      (useRoomStore as unknown as jest.Mock).mockReturnValue(roomStoreMock);
    });

    test("It must render the message that a word is being chosen.", () => {
      const wrapper = shallowMount(BoardSelectingWord, {
        global: {
          plugins: [pinia],
        },
      });

      const message = wrapper.find("h2");
      const messageText = message.text();

      expect(messageText).toEqual(
        `${playerChoosingWord.username} is choosing a word to paint`
      );
    });
  });
});
