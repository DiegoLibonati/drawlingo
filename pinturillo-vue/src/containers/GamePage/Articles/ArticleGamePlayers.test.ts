import { shallowMount } from "@vue/test-utils";

import { createPinia, setActivePinia } from "pinia";

import { Player } from "@src/entities/entities";

import ArticleGamePlayers from "@src/containers/GamePage/Articles/ArticleGamePlayers.vue";

import { useRoomStore } from "@src/stores/room/room";

jest.mock("@src/assets/images/pintando.png", () => "mock-pintando.png");
jest.mock("@src/assets/images/pinto.png", () => "mock-pinto.png");
jest.mock("@src/assets/images/star.png", () => "mock-star.png");

jest.mock("@src/stores/room/room", () => ({
  useRoomStore: jest.fn(),
}));

describe("ArticleGamePlayers.vue", () => {
  let pinia: ReturnType<typeof createPinia>;

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);
  });

  describe("General Tests.", () => {
    const orderPlayersByScore: Player[] = [
      {
        id: "1",
        actualRoom: "asd",
        alreadyPainted: false,
        choosingAWord: false,
        guessed: false,
        isPainting: false,
        score: 10,
        username: "pepe",
      },
    ];

    beforeEach(() => {
      const roomStoreMock = {
        orderPlayersByScore: orderPlayersByScore,
      } as unknown as jest.Mocked<ReturnType<typeof useRoomStore>>;

      (useRoomStore as unknown as jest.Mock).mockReturnValue(roomStoreMock);
    });

    test("It must render the entire cards player game.", async () => {
      const wrapper = shallowMount(ArticleGamePlayers);

      expect(wrapper.exists()).toBe(true);
      expect(wrapper.element.children).toHaveLength(orderPlayersByScore.length);
    });
  });
});
