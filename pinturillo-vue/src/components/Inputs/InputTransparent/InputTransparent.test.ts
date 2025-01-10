import { shallowMount } from "@vue/test-utils";

import InputTransparent from "@/components/Inputs/InputTransparent/InputTransparent.vue";

const props = {
  id: "asds",
  placeholder: "placer",
  modelValue: "tupe",
  labelValue: "text",
  class: "asd",
};

describe("InputTransparent.vue", () => {
  describe("General Tests.", () => {
    test("It must render the input transparent.", () => {
      const wrapper = shallowMount(InputTransparent, {
        props: {
          modelValue: props.modelValue,
          class: props.class,
          id: props.id,
          placeholder: props.placeholder,
          labelValue: props.labelValue,
        },
      });

      const inputTransparent = wrapper.find(`#${props.id}`);
      const label = wrapper.find("label");

      const inputTransparentAttributes = inputTransparent.attributes();
      const inputTransparentClasses = inputTransparent.classes();
      const labelAttributes = label.attributes();

      expect(inputTransparent.exists()).toBe(true);
      expect(inputTransparentAttributes.type).toBe("text");
      expect(inputTransparentAttributes.id).toBe(props.id);
      expect(inputTransparentAttributes.name).toBe(props.id);
      expect(inputTransparentAttributes.placeholder).toBe(props.placeholder);
      expect((inputTransparent.element as HTMLInputElement).value).toBe(
        props.modelValue
      );
      expect(inputTransparentClasses).toEqual([
        "bg-primary",
        "text-white",
        "rounded-lg",
        "bg-opacity-50",
        "border-solid",
        "border-primary",
        "border-[.2rem]",
        "outline-none",
        "transition-all",
        "placeholder:text-white",
        "focus:border-quaternary",
        props.class,
      ]);
      expect(label.exists()).toBe(true);
      expect(labelAttributes.for).toBe(props.id);
    });

    test("It must not render the label", () => {
      const wrapper = shallowMount(InputTransparent, {
        props: {
          modelValue: props.modelValue,
          class: props.class,
          id: props.id,
          placeholder: props.placeholder,
          labelValue: "",
        },
      });

      const label = wrapper.find("label");

      expect(label.exists()).toBe(false);
    });
  });
});
