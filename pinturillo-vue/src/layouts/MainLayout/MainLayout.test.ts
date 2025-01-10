import { shallowMount } from "@vue/test-utils";

import { createRouter, createWebHistory, Router } from "vue-router";

import MainLayout from "@/layouts/MainLayout/MainLayout.vue";

jest.mock("@/assets/images/vue.svg", () => "vue-svg.svg");

const props = {
  layoutType: "flex",
  class: "asd-123",
};

describe("MainLayout.vue", () => {
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
    test("It must render the main.", () => {
      const wrapper = shallowMount(MainLayout, {
        props: {
          class: props.class,
          layoutType: props.layoutType as "flex",
        },
        global: { plugins: [router] },
      });

      expect(wrapper.exists()).toBe(true);
    });

    test("It must render the relevant class added by props.", () => {
      const wrapper = shallowMount(MainLayout, {
        props: {
          class: props.class,
          layoutType: props.layoutType as "flex",
        },
        global: { plugins: [router] },
      });

      expect(wrapper.classes()).toContain(props.class);
    });

    test("It must render the entered slot.", () => {
      const text = "Hi";

      const wrapper = shallowMount(MainLayout, {
        props: {
          class: props.class,
          layoutType: props.layoutType as "flex",
        },
        global: { plugins: [router] },
        slots: { default: `<h2>${text}</h2>` },
      });

      const heading = wrapper.find("h2");

      expect(heading.text()).toBe(text);
    });
  });

  describe("If layoutType is Flex.", () => {
    const layout = "flex";

    test("It must render the relevant class.", () => {
      const wrapper = shallowMount(MainLayout, {
        props: {
          class: props.class,
          layoutType: layout as "flex",
        },
        global: { plugins: [router] },
      });

      expect(wrapper.classes()).toContain(`lg:${layout}`);
    });
  });

  describe("If layoutType is Grid.", () => {
    const layout = "grid";

    test("It must render the relevant class.", () => {
      const wrapper = shallowMount(MainLayout, {
        props: {
          class: props.class,
          layoutType: layout as "grid",
        },
        global: { plugins: [router] },
      });

      expect(wrapper.classes()).toContain(`lg:${layout}`);
    });
  });
});
