import { shallowMount } from "@vue/test-utils";

import SectionLoginPrivateRoom from "@/containers/LoginPrivateRoomPage/Sections/SectionLoginPrivateRoom.vue";

describe("SectionLoginPrivateRoom.vue", () => {
  describe("General Tests.", () => {
    test("It must render the message to connect to a private room with the form login private.", async () => {
      const wrapper = shallowMount(SectionLoginPrivateRoom);

      const heading = wrapper.find("h2");
      const formLoginPrivate = wrapper.find("form-login-private-stub");

      expect(heading.exists()).toBe(true);
      expect(formLoginPrivate.exists()).toBe(true);
    });
  });
});
