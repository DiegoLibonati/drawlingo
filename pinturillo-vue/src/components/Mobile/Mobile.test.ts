import { shallowMount } from "@vue/test-utils";

import Mobile from "@src/components/Mobile/Mobile.vue";

jest.mock("@src/assets/images/vue.svg", () => "vue-svg.svg");

describe("Mobile.vue", () => {
  describe("General Tests.", () => {
    test("It must render the mobile information.", () => {
      const wrapper = shallowMount(Mobile);

      const logo = wrapper.find("logo-stub");
      const heading = wrapper.find("h2");

      expect(wrapper.exists()).toBe(true);
      expect(logo.exists()).toBe(true);
      expect(heading.exists()).toBe(true);
      expect(heading.text()).toBe(
        "This version of pinturillo is not available for touch devices."
      );
    });
  });
});
