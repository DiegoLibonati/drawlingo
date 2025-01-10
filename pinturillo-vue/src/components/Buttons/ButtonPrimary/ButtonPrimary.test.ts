import { shallowMount } from "@vue/test-utils";

import ButtonPrimary from "@/components/Buttons/ButtonPrimary/ButtonPrimary.vue";

const props = {
  mockClick: jest.fn(),
  type: "button",
  slot: "Click me!",
  class: "class_2",
};

describe("ButtonPrimary.vue", () => {
  describe("General Tests.", () => {
    test("It should render the button and when clicked execute the relevant function.", async () => {
      const wrapper = shallowMount(ButtonPrimary, {
        propsData: {
          click: props.mockClick,
          type: props.type as "button",
          class: props.class,
        },
        slots: {
          default: props.slot,
        },
      });

      await wrapper.trigger("click");

      const attributes = wrapper.attributes();
      const classes = wrapper.classes();

      expect(wrapper.text()).toContain(props.slot);
      expect(attributes.type).toEqual("button");
      expect(classes).toContain("bg-primary");
      expect(classes).toContain(props.class);
      expect(props.mockClick).toHaveBeenCalledTimes(1);
    });
  });
});
