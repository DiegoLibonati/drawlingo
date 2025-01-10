import { shallowMount } from "@vue/test-utils";

import { createRouter, createWebHistory, Router } from "vue-router";
import { createPinia, setActivePinia } from "pinia";

import FormLoginPrivate from "@/components/Forms/FormLoginPrivate/FormLoginPrivate.vue";

const mockRoute = {
  idRoom: "asd",
};

describe("FormLoginPrivate.vue", () => {
  let router: Router;
  let pinia: ReturnType<typeof createPinia>;

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);

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
    test("It must render the form.", () => {
      const wrapper = shallowMount(FormLoginPrivate, {
        $route: mockRoute,
        global: { plugins: [router, pinia] },
      });

      const form = wrapper.find("form");

      expect(form.exists()).toBe(true);
    });

    test("It must render the input name, the select type room, the input password, the select slots room, the select rooms round, the select countdown and the submit button.", async () => {
      const wrapper = shallowMount(FormLoginPrivate, {
        $route: mockRoute,
        global: { plugins: [router, pinia] },
      });

      const inputIdRoom = wrapper.find("#idRoom");
      const inputPassword = wrapper.find("#password");
      const btnConnect = wrapper.find("button-secondary-stub");

      const inputIdRoomAttributes = inputIdRoom.attributes();
      const inputPasswordAttributes = inputPassword.attributes();

      expect(inputIdRoom.exists()).toBe(true);
      expect(inputIdRoomAttributes.id).toBe("idRoom");
      expect(inputIdRoomAttributes.placeholder).toBe("Room ID");
      expect(inputIdRoomAttributes.type).toBe("text");
      expect(inputPassword.exists()).toBe(true);
      expect(inputPasswordAttributes.id).toBe("password");
      expect(inputPasswordAttributes.placeholder).toBe("Password");
      expect(inputPasswordAttributes.type).toBe("password");
      expect(btnConnect.exists()).toBe(true);
    });
  });
});
