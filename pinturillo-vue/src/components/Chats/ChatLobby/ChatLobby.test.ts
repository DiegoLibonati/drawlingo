import { shallowMount } from "@vue/test-utils";

import { createPinia, setActivePinia } from "pinia";

import ChatLobby from "@src/components/Chats/ChatLobby/ChatLobby.vue";

import { useUserStore } from "@src/stores/useUserStore";

jest.mock("@src/stores/useUserStore", () => ({
  useUserStore: jest.fn(),
}));

describe("ChatLobby.vue", () => {
  let pinia: ReturnType<typeof createPinia>;

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);
  });

  describe("General Tests.", () => {
    const idUser = "user_123"

    beforeEach(() => {
      const userStoreMock = {
        id: idUser,
      } as unknown as jest.Mocked<ReturnType<typeof useUserStore>>;

      (useUserStore as unknown as jest.Mock).mockReturnValue(userStoreMock);
    });

    test("It must render the message list.", () => {
      const wrapper = shallowMount(ChatLobby, {
        global: {
          plugins: [pinia],
        },
      });

      const list = wrapper.find("article");

      expect(list.exists()).toBe(true);
      expect(list.element.children).toHaveLength(0);
    });

    test("It must render the form chat game.", () => {
      const wrapper = shallowMount(ChatLobby, {
        global: {
          plugins: [pinia],
        },
      });

      const formChatLobby = wrapper.find("form-chat-lobby-stub");

      expect(formChatLobby.exists()).toBe(true);
    });
  });
});
