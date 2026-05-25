import { render, screen } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import { createMemoryHistory, createRouter } from "vue-router";

import type { RenderResult } from "@testing-library/vue";
import type { Router } from "vue-router";

import Logo from "@/components/Logo/Logo.vue";

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

const renderComponent = async (initialRoute = "/"): Promise<RenderResult> => {
  const router = createTestRouter();
  await router.push(initialRoute);
  await router.isReady();

  return render(Logo, {
    global: {
      plugins: [router],
    },
  });
};

describe("Logo", () => {
  beforeEach(() => {
    mockSocket.__reset();
  });

  it("should render the Drawlingo text", async () => {
    await renderComponent();

    expect(screen.getByText("Drawlingo")).toBeTruthy();
  });

  it("should render the VueJS logo image", async () => {
    await renderComponent();

    expect(screen.getByAltText("VueJS logo")).toBeTruthy();
  });

  it("should call socket.disconnect and navigate to home when clicked", async () => {
    const user = userEvent.setup();
    const router = createTestRouter();
    await router.push("/lobby");
    await router.isReady();
    const pushSpy = vi.spyOn(router, "push");

    render(Logo, {
      global: {
        plugins: [router],
      },
    });

    await user.click(screen.getByRole("button"));

    expect(mockSocket.disconnect).toHaveBeenCalledTimes(1);
    expect(pushSpy).toHaveBeenCalledWith("/");
  });
});
