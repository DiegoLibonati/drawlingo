import { render, screen } from "@testing-library/vue";
import { createMemoryHistory, createRouter } from "vue-router";

import type { RenderResult } from "@testing-library/vue";
import type { Router } from "vue-router";

import Header from "@/components/Header/Header.vue";

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

  return render(Header, {
    global: {
      plugins: [router],
    },
  });
};

describe("Header", () => {
  beforeEach(() => {
    mockSocket.__reset();
  });

  it("should render with flex class on a non-game route", async () => {
    await renderComponent("/lobby");

    const header = screen.getByRole("banner");

    expect(header.className).toContain("flex");
    expect(header.className).not.toContain("hidden");
  });

  it("should render with hidden class on a game route", async () => {
    await renderComponent("/game");

    const header = screen.getByRole("banner");

    expect(header.className).toContain("hidden");
  });

  it("should render the Logo component", async () => {
    await renderComponent();

    expect(screen.getByText("Drawlingo")).toBeTruthy();
  });
});
