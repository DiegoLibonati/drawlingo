import { shallowMount } from "@vue/test-utils";

import { createRouter, createWebHistory, Router } from "vue-router";

import Header from "@src/components/Header/Header.vue";

jest.mock("@src/assets/images/vue.svg", () => "vue-logo.svg");

describe("Header.vue", () => {
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
        {
          path: "/room/login/private",
          component: { template: "<div>Room Lobby Id</div>" },
          name: "roomlobbyprivate",
        },
      ],
    });
  });

  describe("General Tests.", () => {
    test("It must render the header and logo.", () => {
      const wrapper = shallowMount(Header, {
        global: { plugins: [router] },
      });

      const header = wrapper.find("header");
      const logo = wrapper.find("logo-stub");

      expect(header.exists()).toBe(true);
      expect(header.classes()).toContain("flex");
      expect(logo.exists()).toBe(true);
    });
  });
});
