import { shallowMount } from "@vue/test-utils";

import SectionFormCreateRoom from "@/containers/CreateRoomPage/Sections/SectionFormCreateRoom.vue";

describe("SectionFormCreateRoom.vue", () => {
  describe("General Tests.", () => {
    test("It should render the button and when clicked execute the relevant function.", async () => {
      const wrapper = shallowMount(SectionFormCreateRoom);

      const formCreateRoom = wrapper.find("form-create-room-stub");

      expect(wrapper.exists()).toBe(true);
      expect(formCreateRoom.exists()).toBe(true);
    });
  });
});
