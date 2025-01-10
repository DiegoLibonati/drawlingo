import { shallowMount } from "@vue/test-utils";

import ArticleGameChat from "@/containers/GamePage/Articles/ArticleGameChat.vue";

jest.mock("@/assets/audios/success.mp3", () => "success.mp3");

describe("ArticleGameChat.vue", () => {
  describe("General Tests.", () => {
    test("It must render the chat game.", async () => {
      const wrapper = shallowMount(ArticleGameChat);

      const chatGame = wrapper.find("chat-game-stub");

      expect(wrapper.exists()).toBe(true);
      expect(chatGame.exists()).toBe(true);
    });
  });
});
