import { shallowMount } from "@vue/test-utils";

import { createPinia, setActivePinia } from "pinia";

import { Player } from "@src/entities/entities";

import ArticleLobbyRoomPlayers from "@src/containers/LobbyRoomPage/Articles/ArticleLobbyRoomPlayers.vue";

import { useRoomStore } from "@src/stores/room/room";

jest.mock("@src/stores/room/room", () => ({
  useRoomStore: jest.fn(),
}));

describe("ArticleLobbyRoomPlayers.vue", () => {
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
        isPainting: false,
        score: 10,
      },
    ];
    const owner = { id: "pepe", actualRoom: "123", username: "pepecito" };

    beforeEach(() => {
      const roomStoreMock = {
        players: players,
        owner: owner,
      } as unknown as jest.Mocked<ReturnType<typeof useRoomStore>>;

      (useRoomStore as unknown as jest.Mock).mockReturnValue(roomStoreMock);
    });

    test("It must render all player cards.", async () => {
      const wrapper = shallowMount(ArticleLobbyRoomPlayers);

      expect(wrapper.element.children).toHaveLength(players.length);
    });
  });
});
