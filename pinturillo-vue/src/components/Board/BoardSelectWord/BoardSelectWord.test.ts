import { shallowMount } from "@vue/test-utils";

import { createPinia, setActivePinia } from "pinia";

import BoardSelectWord from "@src/components/Board/BoardSelectWord/BoardSelectWord.vue";

import { useRoomStore } from "@src/stores/room/room";

jest.mock("@src/stores/room/room", () => ({
  useRoomStore: jest.fn(),
}));

describe("BoardSelectWord.vue", () => {
  let pinia: ReturnType<typeof createPinia>;

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);
  });

  describe("General Tests.", () => {
    const words = ["test", "test2", "test3", "test4"];

    beforeEach(() => {
      const roomStoreMock = {
        wordToGuess: {
          wordsToChoose: words,
        },
      } as unknown as jest.Mocked<ReturnType<typeof useRoomStore>>;

      (useRoomStore as unknown as jest.Mock).mockReturnValue(roomStoreMock);
    });

    test("It must render the menu title.", () => {
      const wrapper = shallowMount(BoardSelectWord, {
        global: {
          plugins: [pinia],
        },
      });

      const message = wrapper.find("h2");
      const messageText = message.text();

      expect(messageText).toEqual("Select a word to paint");
    });

    test("It must render all buttons.", () => {
      const wrapper = shallowMount(BoardSelectWord, {
        global: {
          plugins: [pinia],
        },
      });

      const buttons = wrapper.findAll("button");

      buttons.forEach((button, index) => {
        expect(button.exists()).toBe(true);
        expect(button.text()).toBe(words[index]);
      });
    });
  });
});
