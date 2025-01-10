import { shallowMount } from "@vue/test-utils";

import CardPlayerRoomLobby from "@/components/Cards/CardPlayerRoomLobby/CardPlayerRoomLobby.vue";

const props = {
  username: "pepe",
  isOwner: false,
  class: "qwe",
};

const MockedVIcon = {
  template: '<span class="mocked-v-icon" />',
};

describe("CardPlayerRoomLobby.vue", () => {
  describe("General Tests.", () => {
    test("It must render the root and username.", async () => {
      const wrapper = shallowMount(CardPlayerRoomLobby, {
        propsData: {
          username: props.username,
          isOwner: props.isOwner,
          class: props.class,
        },
        global: {
          components: {
            "v-icon": MockedVIcon,
          },
        },
      });

      const username = wrapper.find(
        "h2.text-white.text-lg.font-semibold.tracking-wide"
      );

      expect(username.exists()).toBe(true);
      expect(username.text()).toEqual(props.username);
      expect(wrapper.exists()).toBe(true);
      expect(wrapper.classes()).toContain(props.class);
    });
  });

  describe("If isOwner is false.", () => {
    const isOwner = false

    test("The v-icon should not be rendered.", async () => {
      const wrapper = shallowMount(CardPlayerRoomLobby, {
        propsData: {
          username: props.username,
          isOwner: isOwner,
          class: props.class,
        },
        global: {
          components: {
            "v-icon": MockedVIcon,
          },
        },
      });

      const icon = wrapper.find("v-icon-stub");

      expect(icon.exists()).toBe(false);
    });
  });

  describe("If isOwner is true.", () => {
    const isOwner = true

    test("The v-icon should be rendered.", async () => {
      const wrapper = shallowMount(CardPlayerRoomLobby, {
        propsData: {
          username: props.username,
          isOwner: isOwner,
          class: props.class,
        },
        global: {
          components: {
            "v-icon": MockedVIcon,
          },
        },
      });

      const icon = wrapper.find("v-icon-stub");
      expect(icon.exists()).toBe(true);
    });
  });
});
