import { shallowMount } from "@vue/test-utils";

import { createPinia, setActivePinia } from "pinia";

import FormCreateRoom from "@src/components/Forms/FormCreateRoom/FormCreateRoom.vue";

describe("FormCreateRoom.vue", () => {
  let pinia: ReturnType<typeof createPinia>;

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);
  });

  describe("General Tests.", () => {
    test("It must render the form.", () => {
      const wrapper = shallowMount(FormCreateRoom);

      const form = wrapper.find("form");

      expect(form.exists()).toBe(true);
    });

    test("It must render the input name, the select type room, the input password, the select slots room, the select rooms round, the select countdown and the submit button.", async () => {
      const wrapper = shallowMount(FormCreateRoom);

      const inputName = wrapper.find("#name");
      const selectType = wrapper.find("#typeRoom");
      const inputPassword = wrapper.find("#password");
      const selectSlots = wrapper.find("#slotsRoom");
      const selectTotalRounds = wrapper.find("#totalRoundsRoom");
      const selectCountdown = wrapper.find("#countdown");
      const btnCreateRoom = wrapper.find("button-secondary-stub");

      const inputNameAttributes = inputName.attributes();

      expect(inputName.exists()).toBe(true);
      expect(inputNameAttributes.id).toBe("name");
      expect(inputNameAttributes.placeholder).toBe(
        "Insert a name for your room..."
      );
      expect(inputNameAttributes.type).toBe("text");
      expect(selectType.exists()).toBe(true);
      expect(inputPassword.exists()).toBe(false);
      expect(selectSlots.exists()).toBe(true);
      expect(selectTotalRounds.exists()).toBe(true);
      expect(selectCountdown.exists()).toBe(true);
      expect(btnCreateRoom.exists()).toBe(true);
    });
  });
});
