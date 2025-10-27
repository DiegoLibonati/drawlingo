import { shallowMount } from "@vue/test-utils";

import { createPinia, setActivePinia } from "pinia";

import SectionLobbyRoom from "@src/components/Sections/SectionLobbyRoom/SectionLobbyRoom.vue";

import { useRoomStore } from "@src/stores/useRoomStore";
import { useUserStore } from "@src/stores/useUserStore";

jest.mock("@src/stores/useUserStore", () => ({
  useUserStore: jest.fn(),
}));
jest.mock("@src/stores/useRoomStore", () => ({
  useRoomStore: jest.fn(),
}));

describe("SectionLobbyRoom.vue", () => {
  let pinia: ReturnType<typeof createPinia>;

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);
  });

  describe("General Tests.", () => {
    const idUser = "12345";

    const playersLength = 2;
    const owner = { id: "123", actualRoom: "pepe", username: "pepito" };

    beforeEach(() => {
      const roomStoreMock = {
        playersLength: playersLength,
        owner: owner,
      } as unknown as jest.Mocked<ReturnType<typeof useRoomStore>>;

      (useRoomStore as unknown as jest.Mock).mockReturnValue(roomStoreMock);

      const userStoreMock = {
        id: idUser,
      } as unknown as jest.Mocked<ReturnType<typeof useUserStore>>;

      (useUserStore as unknown as jest.Mock).mockReturnValue(userStoreMock);
    });

    test("It must render the article lobby room information.", async () => {
      const wrapper = shallowMount(SectionLobbyRoom);

      const lobbyRoomInformation = wrapper.find(
        "article-lobby-room-information-stub"
      );

      expect(lobbyRoomInformation.exists()).toBe(true);
    });

    test("It must render the article lobby room players.", async () => {
      const wrapper = shallowMount(SectionLobbyRoom);

      const lobbyRoomPlayers = wrapper.find("article-lobby-room-players-stub");

      expect(lobbyRoomPlayers.exists()).toBe(true);
    });
  });

  describe("If the length of players 1 or less and the user corresponds to the creator of the room.", () => {
    const idUser = "123";

    const playersLength = 1;
    const owner = { id: idUser, actualRoom: "pepe", username: "pepito" };

    beforeEach(() => {
      const roomStoreMock = {
        playersLength: playersLength,
        owner: owner,
      } as unknown as jest.Mocked<ReturnType<typeof useRoomStore>>;

      (useRoomStore as unknown as jest.Mock).mockReturnValue(roomStoreMock);

      const userStoreMock = {
        id: idUser,
      } as unknown as jest.Mocked<ReturnType<typeof useUserStore>>;

      (useUserStore as unknown as jest.Mock).mockReturnValue(userStoreMock);
    });

    test("It must render the button to wait for other players.", async () => {
      const wrapper = shallowMount(SectionLobbyRoom);

      const btnWaitingOtherPlayers = wrapper.find("button-secondary-stub");

      const btnAttributes = btnWaitingOtherPlayers.attributes();
      const btnClasses = btnWaitingOtherPlayers.classes();

      expect(btnWaitingOtherPlayers.exists()).toBe(true);
      expect(btnAttributes.type).toBe("button");
      expect(btnClasses).toContain("cursor-not-allowed");
    });
  });

  describe("If the length of players 2 or higher and the user corresponds to the creator of the room.", () => {
    const idUser = "123";

    const playersLength = 2;
    const owner = { id: idUser, actualRoom: "pepe", username: "pepito" };

    beforeEach(() => {
      const roomStoreMock = {
        playersLength: playersLength,
        owner: owner,
      } as unknown as jest.Mocked<ReturnType<typeof useRoomStore>>;

      (useRoomStore as unknown as jest.Mock).mockReturnValue(roomStoreMock);

      const userStoreMock = {
        id: idUser,
      } as unknown as jest.Mocked<ReturnType<typeof useUserStore>>;

      (useUserStore as unknown as jest.Mock).mockReturnValue(userStoreMock);
    });

    test("It must render the button to wait for other players.", async () => {
      const wrapper = shallowMount(SectionLobbyRoom);

      const btnWaitingOtherPlayers = wrapper.find("button-secondary-stub");

      const btnAttributes = btnWaitingOtherPlayers.attributes();
      const btnClasses = btnWaitingOtherPlayers.classes();

      expect(btnWaitingOtherPlayers.exists()).toBe(true);
      expect(btnAttributes.type).toBe("button");
      expect(btnClasses).toContain("cursor-pointer");
    });
  });

  describe("If the user NOT corresponds to the creator of the room.", () => {
    const idUser = "12351234";

    const playersLength = 1;
    const owner = { id: "123", actualRoom: "pepe", username: "pepito" };

    beforeEach(() => {
      const roomStoreMock = {
        playersLength: playersLength,
        owner: owner,
      } as unknown as jest.Mocked<ReturnType<typeof useRoomStore>>;

      (useRoomStore as unknown as jest.Mock).mockReturnValue(roomStoreMock);

      const userStoreMock = {
        id: idUser,
      } as unknown as jest.Mocked<ReturnType<typeof useUserStore>>;

      (useUserStore as unknown as jest.Mock).mockReturnValue(userStoreMock);
    });

    test("It must NOT render the button to wait for other players.", async () => {
      const wrapper = shallowMount(SectionLobbyRoom);

      const btnWaitingOtherPlayers = wrapper.find("button-secondary-stub");

      expect(btnWaitingOtherPlayers.exists()).toBe(false);
    });
  });
});
