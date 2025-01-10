import { shallowMount } from "@vue/test-utils";

import { createRouter, createWebHistory, Router } from "vue-router";

import Logo from "@/components/Logo/Logo.vue";

jest.mock("@/assets/images/vue.svg", () => "vue-svg.svg");

describe("Logo.vue", () => {
  let router: Router;

  beforeEach(() => {
    router = createRouter({
      history: createWebHistory(),
      routes: [
        {
          path: "/",
          component: { template: "<div>Home</div>" },
          name: "homepage",
        },
      ],
    });
  });

  describe("General Tests.", () => {
    test("It should render the button with its title and image.", () => {
      const wrapper = shallowMount(Logo, { global: { plugins: [router] } });

      const heading = wrapper.find("h2");
      const img = wrapper.find("img");
      const imgAttributes = img.attributes();
      const btnAttributes = wrapper.attributes();

      expect(wrapper.exists()).toBe(true);
      expect(btnAttributes.type).toBe("button");
      expect(heading.exists()).toBe(true);
      expect(heading.text()).toBe("Pinturillo");
      expect(img.exists()).toBe(true);
      expect(imgAttributes.alt).toBe("VueJS logo");
    });
  });
});
