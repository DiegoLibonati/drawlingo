import { shallowMount } from "@vue/test-utils";

import { createPinia, setActivePinia } from "pinia";

import { Player } from "@/entities/entities";

import ArticleGamePlayers from "@/containers/GamePage/Articles/ArticleGamePlayers.vue";

import { useRoomStore } from "@/stores/room/room";

jest.mock("@/assets/images/pintando.png", () => "mock-pintando.png");
jest.mock("@/assets/images/pinto.png", () => "mock-pinto.png");
jest.mock("@/assets/images/star.png", () => "mock-star.png");

jest.mock("@/stores/room/room", () => ({
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
        isPaiting: false,
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
