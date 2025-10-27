import { shallowMount } from "@vue/test-utils";

import SectionGame from "@src/components/Sections/SectionGame/SectionGame.vue";

describe("SectionGame.vue", () => {
  describe("General Tests.", () => {
    test("It must render the game players, game canvas, game chat and game information article.", async () => {
      const wrapper = shallowMount(SectionGame);

      const articleGamePlayers = wrapper.find("article-game-players-stub");
      const articleGameCanvas = wrapper.find("article-game-canvas-stub");
      const articleGameChat = wrapper.find("article-game-chat-stub");
      const articleGameInformation = wrapper.find(
        "article-game-information-stub"
      );

      expect(articleGamePlayers.exists()).toBe(true);
      expect(articleGameCanvas.exists()).toBe(true);
      expect(articleGameChat.exists()).toBe(true);
      expect(articleGameInformation.exists()).toBe(true);
    });
  });
});
