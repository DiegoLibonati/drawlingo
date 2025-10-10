import { shallowMount } from "@vue/test-utils";

import { createPinia, setActivePinia } from "pinia";

import ArticleGameInformation from "@src/containers/GamePage/Articles/ArticleGameInformation.vue";

import { useRoomStore } from "@src/stores/room/room";

jest.mock("@src/stores/room/room", () => ({
  useRoomStore: jest.fn(),
}));

describe("ArticleGameInformation.vue", () => {
  let pinia: ReturnType<typeof createPinia>;

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);
  });

  describe("General Tests.", () => {
    const idRoom = "1234";
    const rounds = { actualRound: 8, totalRounds: 10 };
    const owner = { id: "123_user", username: "pepe", actualRoom: idRoom };

    beforeEach(() => {
      const roomStoreMock = {
        id: idRoom,
        configuration: {
          rounds: rounds,
        },
        owner: owner,
      } as unknown as jest.Mocked<ReturnType<typeof useRoomStore>>;

      (useRoomStore as unknown as jest.Mock).mockReturnValue(roomStoreMock);
    });

    test("It must render the room id, rounds and room owner.", async () => {
      const wrapper = shallowMount(ArticleGameInformation);

      const headingTexts = wrapper.findAll("h2.text-2xl.font-bold.text-white");
      const headings = wrapper.findAll("h3.text-white.text-xl");

      expect(headingTexts.at(0)!.text()).toBe("Room ID");
      expect(headingTexts.at(1)!.text()).toBe("Rounds");
      expect(headingTexts.at(2)!.text()).toBe("Room Owner");

      expect(headings.at(0)!.text()).toBe(idRoom);
      expect(headings.at(1)!.text()).toBe(
        `${rounds.actualRound}/${rounds.totalRounds}`
      );
      expect(headings.at(2)!.text()).toBe(owner.username);
    });
  });
});
