import { shallowMount } from "@vue/test-utils";

import { createPinia, setActivePinia } from "pinia";

import FormChatGame from "@/components/Forms/FormChatGame/FormChatGame.vue";

describe("FormChatGame.vue", () => {
  let pinia: ReturnType<typeof createPinia>;

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);
  });

  describe("General Tests.", () => {
    test("It must render the form.", () => {
      const wrapper = shallowMount(FormChatGame);

      const form = wrapper.find("form");

      expect(form.exists()).toBe(true);
    });

    test("It must render the secondary input of message and the submit button of send.", () => {
      const wrapper = shallowMount(FormChatGame);

      const inputMessage = wrapper.find("input-secondary-stub");
      const btnSend = wrapper.find("button-secondary-stub");

      const inputMessageAttributes = inputMessage.attributes();
      const btnSendAttributes = btnSend.attributes();

      expect(inputMessage.exists()).toBe(true);
      expect(inputMessageAttributes.id).toBe("message");
      expect(inputMessageAttributes.placeholder).toBe("Enter a message..");
      expect(inputMessageAttributes.type).toBe("text");
      expect(btnSend.exists()).toBe(true);
      expect(btnSendAttributes.type).toBe("submit");
    });
  });
});
