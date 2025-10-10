import { shallowMount } from "@vue/test-utils";

import InputRange from "@src/components/Inputs/InputRange/InputRange.vue";

const props = {
  modelValue: 2,
  class: "asd",
};

describe("InputRange.vue", () => {
  describe("General Tests.", () => {
    test("It must render the color input.", () => {
      const wrapper = shallowMount(InputRange, {
        props: { modelValue: props.modelValue, class: props.class },
      });

      const attributes = wrapper.attributes();
      const classes = wrapper.classes();

      expect(wrapper.exists()).toBe(true);
      expect(attributes.type).toBe("range");
      expect(attributes.min).toBe("0.1");
      expect(attributes.max).toBe("10");
      expect(attributes.step).toBe("0.1");
      expect(wrapper.element.value).toBe(String(props.modelValue));
      expect(classes).toContain(props.class);
    });
  });
});
