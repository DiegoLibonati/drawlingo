import { shallowMount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";

import CardPlayerGame from "@src/components/Cards/CardPlayerGame/CardPlayerGame.vue";
import { useUserStore } from "@src/stores/user/user";

jest.mock("@src/stores/user/user", () => ({
  useUserStore: jest.fn(),
}));

jest.mock("@src/assets/images/pintando.png", () => "mock-pintando.png");
jest.mock("@src/assets/images/pinto.png", () => "mock-pinto.png");
jest.mock("@src/assets/images/star.png", () => "mock-star.png");

const baseProps = {
  position: 1,
  player: {
    id: "user_123",
    username: "usercito",
    actualRoom: "1234",
    isPainting: false,
    alreadyPainted: false,
    choosingAWord: false,
    score: 10,
    guessed: false,
  },
};

describe("CardPlayerGame.vue", () => {
  let pinia: ReturnType<typeof createPinia>;

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);
  });

  describe("General Tests.", () => {
    const idUser = baseProps.player.id;

    beforeEach(() => {
      const userStoreMock = { id: idUser } as unknown as jest.Mocked<
        ReturnType<typeof useUserStore>
      >;
      (useUserStore as unknown as jest.Mock).mockReturnValue(userStoreMock);
    });

    test("It must render the position.", () => {
      const wrapper = shallowMount(CardPlayerGame, {
        propsData: baseProps,
        global: { plugins: [pinia] },
      });

      const position = wrapper.find("h2.text-6xl.text-primary.font-bold");
      expect(position.exists()).toBe(true);
      expect(position.text()).toBe(String(baseProps.position));
    });

    test("It must render the username.", () => {
      const wrapper = shallowMount(CardPlayerGame, {
        propsData: baseProps,
        global: { plugins: [pinia] },
      });

      const username = wrapper.find(
        "h3.text-xl.font-semibold.overflow-hidden.truncate.w-12"
      );
      expect(username.exists()).toBe(true);
      expect(username.text()).toBe(String(baseProps.player.username));
    });

    test("It must render the score.", () => {
      const wrapper = shallowMount(CardPlayerGame, {
        propsData: baseProps,
        global: { plugins: [pinia] },
      });

      const score = wrapper.find("h4.text-xl.text-white.font-semibold");
      expect(score.exists()).toBe(true);
      expect(score.text()).toBe(String(baseProps.player.score));
    });
  });

  describe("If the player matches the user id of the session.", () => {
    beforeEach(() => {
      (useUserStore as unknown as jest.Mock).mockReturnValue({
        id: baseProps.player.id,
      });
    });

    test("It must render the username with the relevant class.", () => {
      const wrapper = shallowMount(CardPlayerGame, {
        propsData: baseProps,
        global: { plugins: [pinia] },
      });

      const username = wrapper.find(
        "h3.text-xl.font-semibold.overflow-hidden.truncate.w-12"
      );
      expect(username.classes()).toContain("text-tertiary");
    });

    test("It must render the score with the relevant class.", () => {
      const wrapper = shallowMount(CardPlayerGame, {
        propsData: baseProps,
        global: { plugins: [pinia] },
      });

      const score = wrapper.find("h4.text-xl.text-white.font-semibold");
      expect(score.classes()).toContain("text-tertiary");
    });
  });

  describe("If the player NOT matches the user id of the session.", () => {
    beforeEach(() => {
      (useUserStore as unknown as jest.Mock).mockReturnValue({
        id: baseProps.player.id + "_other",
      });
    });

    test("It must render the username with the relevant class.", () => {
      const wrapper = shallowMount(CardPlayerGame, {
        propsData: baseProps,
        global: { plugins: [pinia] },
      });

      const username = wrapper.find(
        "h3.text-xl.font-semibold.overflow-hidden.truncate.w-12"
      );
      expect(username.classes()).toContain("text-white");
      expect(username.classes()).not.toContain("text-tertiary");
    });

    test("It must render the score with the relevant class.", () => {
      const wrapper = shallowMount(CardPlayerGame, {
        propsData: baseProps,
        global: { plugins: [pinia] },
      });

      const score = wrapper.find("h4.text-xl.text-white.font-semibold");
      expect(score.classes()).toContain("text-white");
      expect(score.classes()).not.toContain("text-tertiary");
    });
  });

  describe("If the player has already guessed.", () => {
    beforeEach(() => {
      (useUserStore as unknown as jest.Mock).mockReturnValue({
        id: "different_user",
      });
    });

    test("It must render the relevant image.", () => {
      const wrapper = shallowMount(CardPlayerGame, {
        propsData: {
          ...baseProps,
          player: { ...baseProps.player, guessed: true },
        },
        global: { plugins: [pinia] },
      });

      const img = wrapper.find('img[alt="star guess"]');
      expect(img.exists()).toBe(true);
    });
  });

  describe("If the player has already painted.", () => {
    beforeEach(() => {
      (useUserStore as unknown as jest.Mock).mockReturnValue({
        id: "different_user",
      });
    });

    test("It must render the relevant image.", () => {
      const wrapper = shallowMount(CardPlayerGame, {
        propsData: {
          ...baseProps,
          player: {
            ...baseProps.player,
            isPainting: false,
            alreadyPainted: true,
          },
        },
        global: { plugins: [pinia] },
      });

      const img = wrapper.find('img[alt="player painted"]:not(.grayscale)');
      expect(img.exists()).toBe(true);
    });
  });

  describe("If the player is painting.", () => {
    beforeEach(() => {
      (useUserStore as unknown as jest.Mock).mockReturnValue({
        id: "different_user",
      });
    });

    test("It must render the relevant image.", () => {
      const wrapper = shallowMount(CardPlayerGame, {
        propsData: {
          ...baseProps,
          player: {
            ...baseProps.player,
            isPainting: true,
            alreadyPainted: false,
          },
        },
        global: { plugins: [pinia] },
      });

      const img = wrapper.find('img[alt="player painting"]');
      expect(img.exists()).toBe(true);
    });
  });

  describe("If the player is not painting and not painted.", () => {
    beforeEach(() => {
      (useUserStore as unknown as jest.Mock).mockReturnValue({
        id: "different_user",
      });
    });

    test("It must render the relevant image.", () => {
      const wrapper = shallowMount(CardPlayerGame, {
        propsData: {
          ...baseProps,
          player: {
            ...baseProps.player,
            isPainting: false,
            alreadyPainted: false,
          },
        },
        global: { plugins: [pinia] },
      });

      const img = wrapper.find('img[alt="player painted"].grayscale');
      expect(img.exists()).toBe(true);
      expect(img.classes()).toContain("grayscale");
    });
  });
});
