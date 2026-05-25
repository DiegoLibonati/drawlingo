import { render, screen } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import { createTestingPinia } from "@pinia/testing";
import { createMemoryHistory, createRouter } from "vue-router";

import type { RenderResult } from "@testing-library/vue";
import type { Router } from "vue-router";

import FormLoginPrivate from "@/components/Forms/FormLoginPrivate/FormLoginPrivate.vue";

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
      { path: "/lobby", component: { template: "<div>Lobby</div>" } },
      {
        path: "/room/lobby/:id",
        component: { template: "<div>Room</div>" },
      },
      {
        path: "/room/create",
        component: { template: "<div>Create</div>" },
      },
      {
        path: "/room/login/private",
        component: { template: "<div>Login</div>" },
      },
      { path: "/game", component: { template: "<div>Game</div>" } },
      { path: "/score", component: { template: "<div>Score</div>" } },
    ],
  });

const renderComponent = async (initialRoute = "/room/login/private"): Promise<RenderResult> => {
  const router = createTestRouter();
  await router.push(initialRoute);
  await router.isReady();

  return render(FormLoginPrivate, {
    global: {
      plugins: [
        router,
        createTestingPinia({
          createSpy: vi.fn,
          initialState: {
            alert: {
              type: "",
              message: "",
            },
          },
        }),
      ],
    },
  });
};

describe("FormLoginPrivate", () => {
  beforeEach(() => {
    mockSocket.__reset();
  });

  it("should render the idRoom and password inputs", async () => {
    await renderComponent();

    expect(screen.getByPlaceholderText("Room ID")).toBeTruthy();
    expect(screen.getByPlaceholderText("Password")).toBeTruthy();
  });

  it("should render the submit button with Connect text when no idRoom", async () => {
    await renderComponent();

    expect(screen.getByRole("button", { name: "Connect" })).toBeTruthy();
  });

  it("should read idRoom from route query on mount", async () => {
    await renderComponent("/room/login/private?idRoom=test-room");

    const idRoomInput = screen.getByPlaceholderText<HTMLInputElement>("Room ID");

    expect(idRoomInput.value).toBe("test-room");
  });

  it("should display Connect to idRoom in submit button when idRoom is set", async () => {
    await renderComponent("/room/login/private?idRoom=test-room");

    expect(screen.getByRole("button", { name: "Connect to test-room" })).toBeTruthy();
  });

  it("should emit LOGIN_PRIVATE_ROOM socket event with valid data", async () => {
    const user = userEvent.setup();
    await renderComponent();

    const idRoomInput = screen.getByPlaceholderText("Room ID");
    const passwordInput = screen.getByPlaceholderText("Password");

    await user.type(idRoomInput, "room-abc");
    await user.type(passwordInput, "pass123");
    await user.click(screen.getByRole("button", { name: /Connect/i }));

    expect(mockSocket.emit).toHaveBeenCalledWith(
      "login private room",
      { idRoom: "room-abc", password: "pass123" },
      expect.any(Function)
    );
  });

  it("should reset form after a successful submit", async () => {
    const user = userEvent.setup();
    await renderComponent();

    const idRoomInput = screen.getByPlaceholderText<HTMLInputElement>("Room ID");
    const passwordInput = screen.getByPlaceholderText<HTMLInputElement>("Password");

    await user.type(idRoomInput, "room-abc");
    await user.type(passwordInput, "pass123");
    await user.click(screen.getByRole("button", { name: /Connect/i }));

    expect(idRoomInput.value).toBe("");
    expect(passwordInput.value).toBe("");
  });

  it("should show alert when fields are empty", async () => {
    const user = userEvent.setup();
    await renderComponent();

    await user.click(screen.getByRole("button", { name: "Connect" }));

    const alertStore = useAlertStore();

    expect(alertStore.setAlert).toHaveBeenCalledWith({
      type: "warning",
      message: "You must enter an ID and password to enter a private room.",
    });
    expect(mockSocket.emit).not.toHaveBeenCalled();
  });

  it("should show alert when only idRoom is provided without password", async () => {
    const user = userEvent.setup();
    await renderComponent();

    const idRoomInput = screen.getByPlaceholderText("Room ID");
    await user.type(idRoomInput, "room-abc");
    await user.click(screen.getByRole("button", { name: /Connect/i }));

    const alertStore = useAlertStore();

    expect(alertStore.setAlert).toHaveBeenCalledWith({
      type: "warning",
      message: "You must enter an ID and password to enter a private room.",
    });
    expect(mockSocket.emit).not.toHaveBeenCalled();
  });
});
