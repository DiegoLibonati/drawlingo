import { shallowMount } from "@vue/test-utils";

import { createPinia, setActivePinia } from "pinia";

import FormChatLobby from "@src/components/Forms/FormChatLobby/FormChatLobby.vue";

describe("FormChatLobby.vue", () => {
  let pinia: ReturnType<typeof createPinia>;

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);
  });

  describe("General Tests.", () => {
    test("It must render the form.", () => {
      const wrapper = shallowMount(FormChatLobby);

      const form = wrapper.find("form");

      expect(form.exists()).toBe(true);
    });

    test("It must render the transparent input of message and the submit button of send.", () => {
      const wrapper = shallowMount(FormChatLobby);

      const inputMessage = wrapper.find("input-transparent-stub");
      const btnSend = wrapper.find("button-primary-stub");

      const inputMessageAttributes = inputMessage.attributes();
      const btnSendAttributes = btnSend.attributes();

      expect(inputMessage.exists()).toBe(true);
      expect(inputMessageAttributes.id).toBe("message");
      expect(inputMessageAttributes.placeholder).toBe("Enter a message..");
      expect(btnSend.exists()).toBe(true);
      expect(btnSendAttributes.type).toBe("submit");
    });
  });
});
