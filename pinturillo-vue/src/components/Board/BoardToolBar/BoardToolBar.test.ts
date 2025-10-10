import { shallowMount } from "@vue/test-utils";

import { createPinia, setActivePinia } from "pinia";

import BoardToolBar from "@src/components/Board/BoardToolBar/BoardToolBar.vue";

describe("BoardToolBar.vue", () => {
  let pinia: ReturnType<typeof createPinia>;

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);
  });

  describe("General Tests.", () => {
    test("It must render the input color, the input range and the clear button.", () => {
      const wrapper = shallowMount(BoardToolBar, {
        global: {
          plugins: [pinia],
        },
      });

      const inputColor = wrapper.find("input-color-stub");
      const inputSize = wrapper.find("input-range-stub");
      const btnClear = wrapper.find("button-secondary-stub");

      expect(inputColor.exists()).toBe(true);
      expect(inputSize.exists()).toBe(true);
      expect(btnClear.exists()).toBe(true);
    });
  });
});
