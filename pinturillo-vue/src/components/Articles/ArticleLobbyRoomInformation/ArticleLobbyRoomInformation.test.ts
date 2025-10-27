import { shallowMount } from "@vue/test-utils";

import { createPinia, setActivePinia } from "pinia";

import ArticleLobbyRoomInformation from "@src/components/Articles/ArticleLobbyRoomInformation/ArticleLobbyRoomInformation.vue";

import { useRoomStore } from "@src/stores/useRoomStore";

jest.mock("@src/stores/useRoomStore", () => ({
  useRoomStore: jest.fn(),
}));

describe("ArticleLobbyRoomInformation.vue", () => {
  let pinia: ReturnType<typeof createPinia>;

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);
  });

  describe("General Tests.", () => {
    const idRoom = "ds_23";

    beforeEach(() => {
      const roomStoreMock = {
        id: idRoom,
      } as unknown as jest.Mocked<ReturnType<typeof useRoomStore>>;

      (useRoomStore as unknown as jest.Mock).mockReturnValue(roomStoreMock);
    });

    test("It must render the heading of the id of the room.", async () => {
      const wrapper = shallowMount(ArticleLobbyRoomInformation);

      const idRoomHeading = wrapper.find("h2.text-white");

      expect(idRoomHeading.exists()).toBe(true);
      expect(idRoomHeading.text()).toBe(`ROOM ID: ${idRoom}`);
    });
  });
});
