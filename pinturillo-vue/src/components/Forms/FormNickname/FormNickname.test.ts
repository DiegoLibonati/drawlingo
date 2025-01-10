import { shallowMount } from "@vue/test-utils";

import { createPinia, setActivePinia } from "pinia";

import FormNickname from "@/components/Forms/FormNickname/FormNickname.vue";

describe("FormNickname.vue", () => {
  let pinia: ReturnType<typeof createPinia>;

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);
  });

  describe("General Tests.", () => {
    test("It must render the form.", () => {
      const wrapper = shallowMount(FormNickname);

      const form = wrapper.find("form");

      expect(form.exists()).toBe(true);
    });

    test("It must render the secondary input of message and the submit button of send.", () => {
      const wrapper = shallowMount(FormNickname);

      const inputNickname = wrapper.find("input-transparent-stub");
      const btnLobby = wrapper.find("#btn-lobby");
      const btnCreateRoom = wrapper.find("#btn-create-room");
      const btnJoinToPrivateRoom = wrapper.find("#btn-join-to-private-room");

      const inputNicknameAttributes = inputNickname.attributes();

      expect(inputNickname.exists()).toBe(true);
      expect(inputNicknameAttributes.id).toBe("nickname");
      expect(inputNicknameAttributes.placeholder).toBe("Insert your nickname");
      expect(btnLobby.exists()).toBe(true);
      expect(btnCreateRoom.exists()).toBe(true);
      expect(btnJoinToPrivateRoom.exists()).toBe(true);
    });
  });
});
