import { shallowMount } from "@vue/test-utils";

import { createPinia, setActivePinia } from "pinia";

import ModalAlert from "@src/components/Modal/ModalAlert/ModalAlert.vue";

import { useAlertStore } from "@src/stores/alert/alert";

jest.mock("@src/stores/alert/alert", () => ({
  useAlertStore: jest.fn(),
}));

const MockedVIcon = {
  template: '<span class="mocked-v-icon" />',
};

describe("ModalAlert.vue", () => {
  let pinia: ReturnType<typeof createPinia>;

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);
  });

  describe("General Tests.", () => {
    const mockClearAlert = jest.fn();

    const type = "info"
    const description = "Hola"
    const message = "Holiwi"

    beforeEach(() => {
      const userStoreMock = {
        type: type,
        description: description,
        message: message,
        clearAlert: mockClearAlert,
      } as unknown as jest.Mocked<ReturnType<typeof useAlertStore>>;

      (useAlertStore as unknown as jest.Mock).mockReturnValue(userStoreMock);
    });

    test("It must render the description, the message and the close button.", () => {
      const wrapper = shallowMount(ModalAlert, {
        global: {
          plugins: [pinia],
          components: {
            "v-icon": MockedVIcon,
          },
        },
      });

      const description = wrapper.find(
        "h2.font-semibold.text-2xl.ml-2.text-white.tracking-wide"
      );
      const message = wrapper.find(
        "h2.font-semibold.text-xl.my-2.text-justify.tracking-wide.px-4"
      );
      const btnClose = wrapper.find("button");

      expect(description.exists()).toBe(true);
      expect(message.exists()).toBe(true);
      expect(btnClose.exists()).toBe(true);
    });

    test("It must execute the relevant functions when you click on close modal.", async () => {
      const wrapper = shallowMount(ModalAlert, {
        global: {
          plugins: [pinia],
          components: {
            "v-icon": MockedVIcon,
          },
        },
      });

      const btnClose = wrapper.find("button");

      await btnClose.trigger("click");

      expect(mockClearAlert).toHaveBeenCalledTimes(1);
    });
  });

  describe("If key type is info.", () => {
    const mockClearAlert = jest.fn();

    const type = "info"
    const description = "Hola"
    const message = "Holiwi"

    beforeEach(() => {
      const userStoreMock = {
        type: type,
        description: description,
        message: message,
        clearAlert: mockClearAlert,
      } as unknown as jest.Mocked<ReturnType<typeof useAlertStore>>;

      (useAlertStore as unknown as jest.Mock).mockReturnValue(userStoreMock);
    });

    test("It must render the relevant icon.", () => {
      const wrapper = shallowMount(ModalAlert, {
        global: {
          plugins: [pinia],
          components: {
            "v-icon": MockedVIcon,
          },
        },
      });

      const icon = wrapper.find("v-icon-stub")
      const iconAttributes = icon.attributes()

      expect(icon.exists()).toBe(true)
      expect(iconAttributes.name).toBe("fa-info")
    });
  });

  describe("If key type is error.", () => {
    const mockClearAlert = jest.fn();

    const type = "error"
    const description = "Hola"
    const message = "Holiwi"

    beforeEach(() => {
      const userStoreMock = {
        type: type,
        description: description,
        message: message,
        clearAlert: mockClearAlert,
      } as unknown as jest.Mocked<ReturnType<typeof useAlertStore>>;

      (useAlertStore as unknown as jest.Mock).mockReturnValue(userStoreMock);
    });

    test("It must render the relevant icon.", () => {
      const wrapper = shallowMount(ModalAlert, {
        global: {
          plugins: [pinia],
          components: {
            "v-icon": MockedVIcon,
          },
        },
      });

      const icon = wrapper.find("v-icon-stub")
      const iconAttributes = icon.attributes()

      expect(icon.exists()).toBe(true)
      expect(iconAttributes.name).toBe("fa-bug")
    });
  });

  describe("If key type is warning.", () => {
    const mockClearAlert = jest.fn();

    const type = "warning"
    const description = "Hola"
    const message = "Holiwi"

    beforeEach(() => {
      const userStoreMock = {
        type: type,
        description: description,
        message: message,
        clearAlert: mockClearAlert,
      } as unknown as jest.Mocked<ReturnType<typeof useAlertStore>>;

      (useAlertStore as unknown as jest.Mock).mockReturnValue(userStoreMock);
    });

    test("It must render the relevant icon.", () => {
      const wrapper = shallowMount(ModalAlert, {
        global: {
          plugins: [pinia],
          components: {
            "v-icon": MockedVIcon,
          },
        },
      });

      const icon = wrapper.find("v-icon-stub")
      const iconAttributes = icon.attributes()

      expect(icon.exists()).toBe(true)
      expect(iconAttributes.name).toBe("fa-triangle-exclamation")
    });
  });
});
