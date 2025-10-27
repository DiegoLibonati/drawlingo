import { shallowMount } from "@vue/test-utils";

import { createRouter, createWebHistory, Router } from "vue-router";

import SectionPlayersScore from "@src/components/Sections/SectionPlayersScore/SectionPlayersScore.vue";

describe("SectionPlayersScore.vue", () => {
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
    test("It should render the title, the list of players per score and the exit button.", async () => {
      const wrapper = shallowMount(SectionPlayersScore, {
        global: { plugins: [router] },
      });

      const heading = wrapper.find("h2");
      const listPlayersScore = wrapper.find("article-list-players-score-stub");
      const btnExit = wrapper.find("button-secondary-stub");

      expect(heading.exists()).toBe(true);
      expect(heading.text()).toBe("Final Standings");
      expect(listPlayersScore.exists()).toBe(true);
      expect(btnExit.exists()).toBe(true);
    });
  });
});
