import { render, screen } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import { createTestingPinia } from "@pinia/testing";
import { createMemoryHistory, createRouter } from "vue-router";

import type { RenderResult } from "@testing-library/vue";
import type { Router } from "vue-router";

import FormCreateRoom from "@/components/Forms/FormCreateRoom/FormCreateRoom.vue";

import { useAlertStore } from "@/stores/useAlertStore";

import { mockSocket } from "@tests/__mocks__/socket.mock";

vi.mock("@/socket", async () => {
  const { mockSocket } = await import("@tests/__mocks__/socket.mock");
  return { default: mockSocket };
});

const createTestRouter = (): Router =>
  createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: "/", component: { template: "<div />" } },
      { path: "/room/lobby/:id", component: { template: "<div />" } },
      { path: "/room/create", component: { template: "<div />" } },
    ],
  });

const renderComponent = (userState: Record<string, unknown> = {}): RenderResult => {
  const router = createTestRouter();

  return render(FormCreateRoom, {
    global: {
      plugins: [
        createTestingPinia({
          createSpy: vi.fn,
          initialState: {
            user: {
              id: "user-1",
              username: "TestUser",
              actualRoom: "",
              ...userState,
            },
            alert: {
              type: "",
              message: "",
            },
          },
        }),
        router,
      ],
    },
  });
};

describe("FormCreateRoom", () => {
  beforeEach(() => {
    mockSocket.__reset();
  });

  it("should render the form elements", () => {
    renderComponent();

    expect(screen.getByPlaceholderText("Insert a name for your room...")).toBeTruthy();
    expect(screen.getByRole("button", { name: /Create room/i })).toBeTruthy();
  });

  it("should set the default room name from userStore username on mount", async () => {
    renderComponent({ username: "Alice" });

    const nameInput = await screen.findByDisplayValue("Room of Alice");

    expect(nameInput).toBeTruthy();
  });

  it("should emit CREATE_ROOM socket event on valid submit", async () => {
    const user = userEvent.setup();
    renderComponent({ username: "Alice" });

    await user.click(screen.getByRole("button", { name: /Create room/i }));

    expect(mockSocket.emit).toHaveBeenCalledWith(
      "create room",
      {
        name: "Room of Alice",
        type: "public",
        password: "",
        slots: 6,
        totalRounds: 1,
        countdown: 10,
      },
      expect.any(Function)
    );
  });

  it("should call alertStore.setAlert when name is empty", async () => {
    const user = userEvent.setup();
    renderComponent();

    const nameInput = await screen.findByPlaceholderText("Insert a name for your room...");
    await user.clear(nameInput);
    await user.click(screen.getByRole("button", { name: /Create room/i }));

    const alertStore = useAlertStore();

    expect(alertStore.setAlert).toHaveBeenCalledWith({
      type: "warning",
      message: "Enter a valid room name, if you are creating a private room, it needs a password.",
    });
    expect(mockSocket.emit).not.toHaveBeenCalled();
  });

  it("should call alertStore.setAlert when private room has no password", async () => {
    const user = userEvent.setup();
    renderComponent({ username: "Alice" });

    const typeSelect = document.querySelector<HTMLSelectElement>("#typeRoom")!;
    await user.selectOptions(typeSelect, "private");
    await user.click(screen.getByRole("button", { name: /Create room/i }));

    const alertStore = useAlertStore();

    expect(alertStore.setAlert).toHaveBeenCalledWith({
      type: "warning",
      message: "Enter a valid room name, if you are creating a private room, it needs a password.",
    });
    expect(mockSocket.emit).not.toHaveBeenCalled();
  });

  it("should emit CREATE_ROOM with password when private room has valid data", async () => {
    const user = userEvent.setup();
    renderComponent({ username: "Alice" });

    const typeSelect = document.querySelector<HTMLSelectElement>("#typeRoom")!;
    await user.selectOptions(typeSelect, "private");

    const passwordInput = screen.getByPlaceholderText("Insert a password for your room...");
    await user.type(passwordInput, "secret123");
    await user.click(screen.getByRole("button", { name: /Create room/i }));

    expect(mockSocket.emit).toHaveBeenCalledWith(
      "create room",
      {
        name: "Room of Alice",
        type: "private",
        password: "secret123",
        slots: 6,
        totalRounds: 1,
        countdown: 10,
      },
      expect.any(Function)
    );
  });
});
