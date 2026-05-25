import { render, screen } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import { createTestingPinia } from "@pinia/testing";

import type { RenderResult } from "@testing-library/vue";

import ModalAlert from "@/components/Modal/ModalAlert/ModalAlert.vue";

import { useAlertStore } from "@/stores/useAlertStore";

const renderComponent = (alertState: {
  type: "" | "info" | "warning" | "error";
  message: string;
}): RenderResult => {
  return render(ModalAlert, {
    global: {
      plugins: [
        createTestingPinia({
          createSpy: vi.fn,
          initialState: {
            alert: alertState,
          },
        }),
      ],
      stubs: { "v-icon": true },
    },
  });
};

describe("ModalAlert", () => {
  it("should render the description for info type", () => {
    renderComponent({ type: "info", message: "Some info message" });

    expect(screen.getByText("Info")).toBeTruthy();
  });

  it("should render the description for error type", () => {
    renderComponent({ type: "error", message: "Some error message" });

    expect(screen.getByText("Error")).toBeTruthy();
  });

  it("should render the description for warning type", () => {
    renderComponent({ type: "warning", message: "Some warning message" });

    expect(screen.getByText("Warning")).toBeTruthy();
  });

  it("should render the alert message", () => {
    renderComponent({ type: "info", message: "This is a test alert" });

    expect(screen.getByText("This is a test alert")).toBeTruthy();
  });

  it("should render the Close button", () => {
    renderComponent({ type: "info", message: "Test" });

    expect(screen.getByRole("button", { name: "Close" })).toBeTruthy();
  });

  it("should call clearAlert when Close button is clicked", async () => {
    const user = userEvent.setup();
    renderComponent({ type: "error", message: "Error occurred" });

    const alertStore = useAlertStore();

    await user.click(screen.getByRole("button", { name: "Close" }));

    expect(alertStore.clearAlert).toHaveBeenCalledTimes(1);
  });

  it("should render the correct message for different alert content", () => {
    renderComponent({
      type: "warning",
      message: "Please check your connection",
    });

    expect(screen.getByText("Please check your connection")).toBeTruthy();
  });
});
