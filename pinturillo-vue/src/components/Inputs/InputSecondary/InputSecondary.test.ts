import { shallowMount } from "@vue/test-utils";

import InputSecondary from "@src/components/Inputs/InputSecondary/InputSecondary.vue";

const props = {
  id: "asds",
  placeholder: "placer",
  type: "text",
  modelValue: "tupe",
  class: "asd",
};

describe("InputSecondary.vue", () => {
  describe("General Tests.", () => {
    test("It must render the input secondary.", () => {
      const wrapper = shallowMount(InputSecondary, {
        props: {
          modelValue: props.modelValue,
          class: props.class,
          id: props.id,
          placeholder: props.placeholder,
          type: props.type,
        },
      });

      const attributes = wrapper.attributes();
      const classes = wrapper.classes();

      expect(wrapper.exists()).toBe(true);
      expect(attributes.type).toBe(props.type);
      expect(attributes.placeholder).toBe(props.placeholder);
      expect(attributes.id).toBe(props.id);
      expect(attributes.name).toBe(props.id);
      expect(wrapper.element.value).toBe(props.modelValue);
      expect(classes).toEqual([
        "w-full",
        "rounded-lg",
        "bg-secondary",
        "border-secondary",
        "border-[.2rem]",
        "px-2",
        "text-white",
        "text-lg",
        "outline-none",
        "transition-all",
        "placeholder:text-white",
        "focus:border-quaternary",
        props.class,
      ]);
    });
  });
});
