import { shallowMount } from "@vue/test-utils";

import { createRouter, createWebHistory, Router } from "vue-router";

import CardLobby from "@src/components/Cards/CardLobby/CardLobby.vue";

const props = {
  idRoom: "asd",
  totalSlots: 8,
  usersInRoom: 5,
  ownerRoom: {
    id: "user_1",
    username: "username",
    actualRoom: "asd",
  },
  nameRoom: "Roomcita",
  typeRoom: "Public Room",
};

describe("CardLobby.vue", () => {
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
          path: "/room/lobby/:id",
          component: { template: "<div>Room Lobby Id</div>" },
          name: "roomlobbyid",
        },
      ],
    });
  });

  describe("General Tests.", () => {
    test("It must render the owner, name, type and slots of the room.", () => {
      const wrapper = shallowMount(CardLobby, {
        propsData: {
          idRoom: props.idRoom,
          nameRoom: props.nameRoom,
          ownerRoom: props.ownerRoom,
          totalSlots: props.totalSlots,
          usersInRoom: props.usersInRoom,
          typeRoom: props.typeRoom,
        },
        global: {
          plugins: [router],
        },
      });

      const h3Elements = wrapper.findAll("h3.text-white.font-semibold.text-sm");

      expect(h3Elements.at(0)!.text()).toBe(
        `Owner: ${props.ownerRoom.username}`
      );
      expect(h3Elements.at(1)!.text()).toBe(`Name: ${props.nameRoom}`);
      expect(h3Elements.at(2)!.text()).toBe(`Type: ${props.typeRoom}`);
      expect(h3Elements.at(3)!.text()).toBe(
        `Slots: (${props.usersInRoom}/${props.totalSlots})`
      );
    });
  });
});
