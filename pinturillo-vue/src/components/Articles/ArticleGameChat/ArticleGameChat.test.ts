import { shallowMount } from "@vue/test-utils";

import ArticleGameChat from "@src/components/Articles/ArticleGameChat/ArticleGameChat.vue";

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
