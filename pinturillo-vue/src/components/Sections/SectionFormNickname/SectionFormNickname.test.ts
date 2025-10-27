import { shallowMount } from "@vue/test-utils";

import SectionFormNickname from "@src/components/Sections/SectionFormNickname/SectionFormNickname.vue";

describe("SectionFormNickname.vue", () => {
  describe("General Tests.", () => {
    test("It must render the form nickname.", async () => {
      const wrapper = shallowMount(SectionFormNickname);

      const formNickname = wrapper.find("form-nickname-stub");

      expect(formNickname.exists()).toBe(true);
    });
  });
});
