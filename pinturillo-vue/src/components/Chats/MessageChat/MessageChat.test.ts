import { shallowMount } from "@vue/test-utils";

import MessageChat from "@src/components/Chats/MessageChat/MessageChat.vue";

const props = {
  username: "usercito",
  message: "mensajito 1",
  classUsername: "1234",
};

describe("MessageChat.vue", () => {
  test("It should render the button and when clicked execute the relevant function.", async () => {
    const wrapper = shallowMount(MessageChat, {
      propsData: {
        message: props.message,
        username: props.username,
        classUsername: props.classUsername,
      },
    });

    const message = wrapper.find("h2.text-white.font-semibold.text-lg");
    const spanUsername = wrapper.find(`span`);

    expect(message.exists()).toBe(true);
    expect(message.text()).toBe(`${props.username}: ${props.message}`);
    expect(spanUsername.exists()).toBe(true);
    expect(spanUsername.text()).toBe(`${props.username}:`);
    expect(spanUsername.classes()).toContain(props.classUsername);
  });
});
