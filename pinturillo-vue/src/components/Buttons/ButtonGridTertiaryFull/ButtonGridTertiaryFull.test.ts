import { shallowMount } from "@vue/test-utils";

import ButtonGridTertiaryFull from "@/components/Buttons/ButtonGridTertiaryFull/ButtonGridTertiaryFull.vue";

const props = {
  mockClick: jest.fn(),
  slot: "Click me!",
};

describe("ButtonGridTertiaryFull.vue", () => {
  describe("General Tests.", () => {
    test("It should render the button and when clicked execute the relevant function.", async () => {
      const wrapper = shallowMount(ButtonGridTertiaryFull, {
        propsData: { click: props.mockClick },
        slots: {
          default: props.slot,
        },
      });

      await wrapper.trigger("click");

      const attributes = wrapper.attributes();
      const classes = wrapper.classes();

      expect(wrapper.text()).toContain(props.slot);
      expect(attributes.type).toEqual("button");
      expect(classes).toContain("bg-tertiary");
      expect(props.mockClick).toHaveBeenCalledTimes(1);
    });
  });
});
