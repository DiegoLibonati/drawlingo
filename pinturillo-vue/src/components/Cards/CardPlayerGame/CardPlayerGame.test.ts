import { shallowMount } from "@vue/test-utils";

import { createPinia, setActivePinia } from "pinia";

import CardPlayerGame from "@/components/Cards/CardPlayerGame/CardPlayerGame.vue";

import { useUserStore } from "@/stores/user/user";

jest.mock("@/stores/user/user", () => ({
  useUserStore: jest.fn(),
}));

jest.mock("@/assets/images/pintando.png", () => "mock-pintando.png");
jest.mock("@/assets/images/pinto.png", () => "mock-pinto.png");
jest.mock("@/assets/images/star.png", () => "mock-star.png");

const props = {
  position: 1,
  player: {
    id: "user_123",
    username: "usercito",
    actualRoom: "1234",
    isPaiting: false,
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
    const idUser = "user_123";

    beforeEach(() => {
      const userStoreMock = {
        id: idUser,
      } as unknown as jest.Mocked<ReturnType<typeof useUserStore>>;

      (useUserStore as unknown as jest.Mock).mockReturnValue(userStoreMock);
    });

    test("It must render the position.", () => {
      const wrapper = shallowMount(CardPlayerGame, {
        propsData: {
          position: props.position,
          player: props.player,
        },
        global: {
          plugins: [pinia],
        },
      });

      const position = wrapper.find("h2.text-6xl.text-primary.font-bold");

      expect(position.exists()).toBe(true);
      expect(position.text()).toBe(String(props.position));
    });

    test("It must render the username.", () => {
      const wrapper = shallowMount(CardPlayerGame, {
        propsData: {
          position: props.position,
          player: props.player,
        },
        global: {
          plugins: [pinia],
        },
      });

      const username = wrapper.find(
        "h3.text-xl.font-semibold.overflow-hidden.truncate.w-12"
      );

      expect(username.exists()).toBe(true);
      expect(username.text()).toBe(String(props.player.username));
    });

    test("It must render the score.", () => {
      const wrapper = shallowMount(CardPlayerGame, {
        propsData: {
          position: props.position,
          player: props.player,
        },
        global: {
          plugins: [pinia],
        },
      });

      const score = wrapper.find("h4.text-xl.text-white.font-semibold");

      expect(score.exists()).toBe(true);
      expect(score.text()).toBe(String(props.player.score));
    });
  });

  describe("If the player matches the user id of the session.", () => {
    const idUser = props.player.id;

    beforeEach(() => {
      const userStoreMock = {
        id: idUser,
      } as unknown as jest.Mocked<ReturnType<typeof useUserStore>>;

      (useUserStore as unknown as jest.Mock).mockReturnValue(userStoreMock);
    });

    test("It must render the username with the relevant class.", () => {
      const wrapper = shallowMount(CardPlayerGame, {
        propsData: {
          position: props.position,
          player: props.player,
        },
        global: {
          plugins: [pinia],
        },
      });

      const username = wrapper.find(
        "h3.text-xl.font-semibold.overflow-hidden.truncate.w-12"
      );

      expect(username.classes()).toContain("text-tertiary");
    });

    test("It must render the score with the relevant class.", () => {
      const wrapper = shallowMount(CardPlayerGame, {
        propsData: {
          position: props.position,
          player: props.player,
        },
        global: {
          plugins: [pinia],
        },
      });

      const score = wrapper.find("h4.text-xl.text-white.font-semibold");

      expect(score.classes()).toContain("text-tertiary");
    });
  });

  describe("If the player NOT matches the user id of the session.", () => {
    const idUser = props.player.id + "123";

    beforeEach(() => {
      const userStoreMock = {
        id: idUser,
      } as unknown as jest.Mocked<ReturnType<typeof useUserStore>>;

      (useUserStore as unknown as jest.Mock).mockReturnValue(userStoreMock);
    });

    test("It must render the username with the relevant class.", () => {
      const wrapper = shallowMount(CardPlayerGame, {
        propsData: {
          position: props.position,
          player: props.player,
        },
        global: {
          plugins: [pinia],
        },
      });

      const username = wrapper.find(
        "h3.text-xl.font-semibold.overflow-hidden.truncate.w-12"
      );

      expect(username.classes()).toContain("text-white");
      expect(username.classes()).not.toContain("text-tertiary");
    });

    test("It must render the score with the relevant class.", () => {
      const wrapper = shallowMount(CardPlayerGame, {
        propsData: {
          position: props.position,
          player: props.player,
        },
        global: {
          plugins: [pinia],
        },
      });

      const score = wrapper.find("h4.text-xl.text-white.font-semibold");

      expect(score.classes()).toContain("text-white");
      expect(score.classes()).not.toContain("text-tertiary");
    });
  });

  describe("If the player has already guessed.", () => {
    const idUser = props.player.id + "123";
    const guessed = true;

    beforeEach(() => {
      const userStoreMock = {
        id: idUser,
      } as unknown as jest.Mocked<ReturnType<typeof useUserStore>>;

      (useUserStore as unknown as jest.Mock).mockReturnValue(userStoreMock);
    });

    test("It must render the relevant image.", () => {
      const wrapper = shallowMount(CardPlayerGame, {
        propsData: {
          position: props.position,
          player: {
            ...props.player,
            guessed: guessed,
          },
        },
        global: {
          plugins: [pinia],
        },
      });

      const imgs = wrapper.findAll("img");
      const img = imgs.find((i) => i.element.src.includes("mock-star.png"));

      const attributes = img!.attributes();

      expect(attributes.src).toContain("mock-star.png");
      expect(attributes.alt).toBe("star guess");
    });
  });

  describe("If the player has already painted.", () => {
    const idUser = props.player.id + "123";
    const alreadyPainted = true;

    beforeEach(() => {
      const userStoreMock = {
        id: idUser,
      } as unknown as jest.Mocked<ReturnType<typeof useUserStore>>;

      (useUserStore as unknown as jest.Mock).mockReturnValue(userStoreMock);
    });

    test("It must render the relevant image.", () => {
      const wrapper = shallowMount(CardPlayerGame, {
        propsData: {
          position: props.position,
          player: {
            ...props.player,
            isPaiting: false,
            alreadyPainted: alreadyPainted,
          },
        },
        global: {
          plugins: [pinia],
        },
      });

      const img = wrapper.find("img");
      const attributes = img!.attributes();

      expect(attributes.src).toContain("mock-pinto.png");
      expect(attributes.alt).toBe("player painted");
    });
  });

  describe("If the player is painting.", () => {
    const idUser = props.player.id + "123";
    const isPaiting = true;
    const alreadyPainted = false;

    beforeEach(() => {
      const userStoreMock = {
        id: idUser,
      } as unknown as jest.Mocked<ReturnType<typeof useUserStore>>;

      (useUserStore as unknown as jest.Mock).mockReturnValue(userStoreMock);
    });

    test("It must render the relevant image.", () => {
      const wrapper = shallowMount(CardPlayerGame, {
        propsData: {
          position: props.position,
          player: {
            ...props.player,
            isPaiting: isPaiting,
            alreadyPainted: alreadyPainted,
          },
        },
        global: {
          plugins: [pinia],
        },
      });

      const img = wrapper.find("img");
      const attributes = img!.attributes();

      expect(attributes.src).toContain("mock-pintando.png");
      expect(attributes.alt).toBe("player painting");
    });
  });

  describe("If the player is not painting and not painted.", () => {
    const idUser = props.player.id + "123"
    const isPaiting = false
    const alreadyPainted = false

    beforeEach(() => {
      const userStoreMock = {
        id: idUser,
      } as unknown as jest.Mocked<ReturnType<typeof useUserStore>>;

      (useUserStore as unknown as jest.Mock).mockReturnValue(userStoreMock);
    });

    test("It must render the relevant image.", () => {
      const wrapper = shallowMount(CardPlayerGame, {
        propsData: {
          position: props.position,
          player: {
            ...props.player,
            isPaiting: isPaiting,
            alreadyPainted: alreadyPainted,
          },
        },
        global: {
          plugins: [pinia],
        },
      });

      const img = wrapper.find("img");
      const attributes = img!.attributes();

      expect(attributes.src).toContain("mock-pinto.png");
      expect(attributes.alt).toBe("player painted");
      expect(img.classes()).toContain("grayscale");
    });
  });
});
