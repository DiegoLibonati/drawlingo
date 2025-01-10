import { shallowMount } from "@vue/test-utils";

import InputColor from "@/components/Inputs/InputColor/InputColor.vue";

const props = {
  modelValue: "#ffffff",
  class: "asd",
};

describe("InputColor.vue", () => {
  describe("General Tests.", () => {
    test("It must render the color input.", () => {
      const wrapper = shallowMount(InputColor, {
        props: { modelValue: props.modelValue, class: props.class },
      });

      const attributes = wrapper.attributes();
      const classes = wrapper.classes();

      expect(wrapper.exists()).toBe(true);
      expect(attributes.type).toBe("color");
      expect(wrapper.element.value).toBe(props.modelValue);
      expect(classes).toContain(props.class);
    });
  });
});
