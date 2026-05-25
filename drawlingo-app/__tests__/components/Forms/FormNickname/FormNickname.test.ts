import { render, screen } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import { createTestingPinia } from "@pinia/testing";
import { createMemoryHistory, createRouter } from "vue-router";

import type { RenderResult } from "@testing-library/vue";
import type { Router } from "vue-router";

import FormNickname from "@/components/Forms/FormNickname/FormNickname.vue";

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
      { path: "/lobby", component: { template: "<div />" } },
      { path: "/room/lobby/:id", component: { template: "<div />" } },
      { path: "/room/create", component: { template: "<div />" } },
      { path: "/room/login/private", component: { template: "<div />" } },
      { path: "/game", component: { template: "<div />" } },
      { path: "/score", component: { template: "<div />" } },
    ],
  });

const renderComponent = (): RenderResult => {
  const router = createTestRouter();

  return render(FormNickname, {
    global: {
      plugins: [
        createTestingPinia({
          createSpy: vi.fn,
          initialState: {
            user: { id: "", username: "", actualRoom: "" },
            alert: { type: "", message: "" },
          },
        }),
        router,
      ],
    },
  });
};

describe("FormNickname", () => {
  beforeEach(() => {
    mockSocket.__reset();
    mockSocket.connect.mockImplementation(() => {
      mockSocket.__serverEmit("connect");
      return mockSocket;
    });
  });

  it("should render the nickname input with default value player", () => {
    renderComponent();

    const input = screen.getByPlaceholderText<HTMLInputElement>("Insert your nickname");

    expect(input.value).toBe("player");
  });

  it("should render the Nickname label", () => {
    renderComponent();

    expect(screen.getByText("Nickname")).toBeTruthy();
  });

  it("should render all three navigation buttons", () => {
    renderComponent();

    expect(screen.getByText("LOBBY")).toBeTruthy();
    expect(screen.getByText("CREATE ROOM")).toBeTruthy();
    expect(screen.getByText("JOIN TO PRIVATE ROOM")).toBeTruthy();
  });

  it("should call socket.connect and socket.emit with CONNECT event when LOBBY is clicked", async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.click(screen.getByText("LOBBY"));

    expect(mockSocket.connect).toHaveBeenCalledTimes(1);
    expect(mockSocket.emit).toHaveBeenCalledWith(
      "custom connect",
      { username: "player", pathToRedirect: "/lobby" },
      expect.any(Function)
    );
  });

  it("should call socket.emit with correct path when CREATE ROOM is clicked", async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.click(screen.getByText("CREATE ROOM"));

    expect(mockSocket.connect).toHaveBeenCalledTimes(1);
    expect(mockSocket.emit).toHaveBeenCalledWith(
      "custom connect",
      { username: "player", pathToRedirect: "/room/create" },
      expect.any(Function)
    );
  });

  it("should call socket.emit with correct path when JOIN TO PRIVATE ROOM is clicked", async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.click(screen.getByText("JOIN TO PRIVATE ROOM"));

    expect(mockSocket.connect).toHaveBeenCalledTimes(1);
    expect(mockSocket.emit).toHaveBeenCalledWith(
      "custom connect",
      { username: "player", pathToRedirect: "/room/login/private" },
      expect.any(Function)
    );
  });

  it("should use the typed nickname in the socket.emit call", async () => {
    const user = userEvent.setup();
    renderComponent();

    const input = screen.getByPlaceholderText("Insert your nickname");
    await user.clear(input);
    await user.type(input, "CustomName");
    await user.click(screen.getByText("LOBBY"));

    expect(mockSocket.emit).toHaveBeenCalledWith(
      "custom connect",
      { username: "CustomName", pathToRedirect: "/lobby" },
      expect.any(Function)
    );
  });

  it("should show warning alert when nickname is empty", async () => {
    const user = userEvent.setup();
    renderComponent();

    const input = screen.getByPlaceholderText("Insert your nickname");
    await user.clear(input);
    await user.click(screen.getByText("LOBBY"));

    const alertStore = useAlertStore();

    expect(alertStore.setAlert).toHaveBeenCalledWith({
      type: "warning",
      message: "Enter a valid username",
    });
    expect(mockSocket.connect).not.toHaveBeenCalled();
  });

  it("should show error alert when socket connection fails", async () => {
    mockSocket.connect.mockImplementation(() => {
      mockSocket.__serverEmit("connect_error", new Error("Connection failed"));
      return mockSocket;
    });

    const user = userEvent.setup();
    renderComponent();

    await user.click(screen.getByText("LOBBY"));

    const alertStore = useAlertStore();

    expect(alertStore.setAlert).toHaveBeenCalledWith({
      type: "error",
      message: "Could not connect to the server, try again",
    });
    expect(mockSocket.emit).not.toHaveBeenCalled();
  });
});
