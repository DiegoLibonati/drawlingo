import { shallowMount } from "@vue/test-utils";

import { createPinia, setActivePinia } from "pinia";

import ChatGame from "@/components/Chats/ChatGame/ChatGame.vue";

import { useUserStore } from "@/stores/user/user";

jest.mock("@/assets/audios/success.mp3", () => "audio_success.mp3");

jest.mock("@/stores/user/user", () => ({
  useUserStore: jest.fn(),
}));

describe("ChatGame.vue", () => {
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
      const wrapper = shallowMount(ChatGame, {
        global: {
          plugins: [pinia],
        },
      });

      const list = wrapper.find("div");

      expect(list.exists()).toBe(true);
      expect(list.element.children).toHaveLength(0);
    });

    test("It must render the form chat game.", () => {
      const wrapper = shallowMount(ChatGame, {
        global: {
          plugins: [pinia],
        },
      });

      const formChatGame = wrapper.find("form-chat-game-stub");

      expect(formChatGame.exists()).toBe(true);
    });
  });
});
