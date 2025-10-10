import { shallowMount } from "@vue/test-utils";

import { createPinia, setActivePinia } from "pinia";

import ArticleLobbyRoomInformation from "@src/containers/LobbyRoomPage/Articles/ArticleLobbyRoomInformation.vue";

import { useRoomStore } from "@src/stores/room/room";

jest.mock("@src/stores/room/room", () => ({
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
