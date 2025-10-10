import { shallowMount } from "@vue/test-utils";

import CardPlayerScore from "@src/components/Cards/CardPlayerScore/CardPlayerScore.vue";

const props = {
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

describe("CardPlayerScore.vue", () => {
  describe("General Tests.", () => {
    test("It must render the position.", () => {
      const wrapper = shallowMount(CardPlayerScore, {
        propsData: {
          position: props.position,
          player: props.player,
        },
      });

      const position = wrapper.find(
        "h3.flex.items-center.justify-center.text-white.text-2xl.bg-primary.rounded-lg.h-12.w-12"
      );

      expect(position.exists()).toBe(true);
      expect(position.text()).toBe(String(props.position));
    });

    test("It must render the username.", () => {
      const wrapper = shallowMount(CardPlayerScore, {
        propsData: {
          position: props.position,
          player: props.player,
        },
      });

      const username = wrapper.find(
        "h4.text-white.font-bold.tracking-wide.text-xl.ml-2"
      );

      expect(username.exists()).toBe(true);
      expect(username.text()).toBe(props.player.username);
    });

    test("It must render the score.", () => {
      const wrapper = shallowMount(CardPlayerScore, {
        propsData: {
          position: props.position,
          player: props.player,
        },
      });

      const score = wrapper.find("h5.text-white.font-bold.tracking-wide");

      expect(score.exists()).toBe(true);
      expect(score.text()).toBe(`${props.player.score} Points`);
    });
  });

  describe("If user position is 1.", () => {
    const position = 1

    test("It must render the position with the correct class.", () => {
      const wrapper = shallowMount(CardPlayerScore, {
        propsData: {
          position: position,
          player: props.player,
        },
      });

      const wrapperClasses = wrapper.classes();

      expect(wrapperClasses).toContain("bg-green-500");
    });
  });

  describe("If user position is 2.", () => {
    const position = 2

    test("It must render the position with the correct class.", () => {
      const wrapper = shallowMount(CardPlayerScore, {
        propsData: {
          position: position,
          player: props.player,
        },
      });

      const wrapperClasses = wrapper.classes();

      expect(wrapperClasses).toContain("bg-yellow-500");
      expect(wrapperClasses).toContain("mt-2");
    });
  });

  describe("If user position is 3 or higher.", () => {
    const position = 3

    test("It must render the position with the correct class.", () => {
      const wrapper = shallowMount(CardPlayerScore, {
        propsData: {
          position: position,
          player: props.player,
        },
      });

      const wrapperClasses = wrapper.classes();

      expect(wrapperClasses).toContain("bg-red-500");
      expect(wrapperClasses).toContain("mt-2");
    });
  });
});
