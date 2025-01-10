import { shallowMount } from "@vue/test-utils";

import { Player } from "@/entities/entities";

import { createPinia, setActivePinia } from "pinia";

import ArticleListPlayersScore from "@/containers/ScorePage/Articles/ArticleListPlayersScore.vue";

import { useRoomStore } from "@/stores/room/room";

jest.mock("@/stores/room/room", () => ({
  useRoomStore: jest.fn(),
}));

describe("ArticleListPlayersScore.vue", () => {
  let pinia: ReturnType<typeof createPinia>;

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);
  });

  describe("General Tests.", () => {
    const players: Player[] = [
      {
        id: "pepe",
        actualRoom: "123",
        username: "pepe",
        alreadyPainted: false,
        choosingAWord: false,
        guessed: false,
        isPaiting: false,
        score: 10,
      },
    ];

    beforeEach(() => {
      const roomStoreMock = {
        orderPlayersByScore: players,
      } as unknown as jest.Mocked<ReturnType<typeof useRoomStore>>;

      (useRoomStore as unknown as jest.Mock).mockReturnValue(roomStoreMock);
    });

    test("It must render the total number of players per score.", async () => {
      const wrapper = shallowMount(ArticleListPlayersScore, {
        global: { plugins: [pinia] },
      });

      expect(wrapper.element.children).toHaveLength(players.length);
    });
  });
});
