import { shallowMount } from "@vue/test-utils";

import SectionLobbyChat from "@src/containers/LobbyPage/Sections/SectionLobbyChat.vue";

describe("SectionLobbyChat.vue", () => {
  describe("General Tests.", () => {
    test("It must render the chat lobby.", async () => {
      const wrapper = shallowMount(SectionLobbyChat);

      const chatLobby = wrapper.find("chat-lobby-stub");

      expect(chatLobby.exists()).toBe(true);
    });
  });
});
