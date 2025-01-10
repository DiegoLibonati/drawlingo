import { shallowMount } from "@vue/test-utils";

import SectionGame from "@/containers/GamePage/Sections/SectionGame.vue";

jest.mock("@/assets/images/pintando.png", () => "mock-pintando.png");
jest.mock("@/assets/images/pinto.png", () => "mock-pinto.png");
jest.mock("@/assets/images/star.png", () => "mock-star.png");
jest.mock("@/assets/audios/success.mp3", () => "success.mp3");

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
