import { render, screen } from "@testing-library/vue";
import { createMemoryHistory, createRouter } from "vue-router";
import { createTestingPinia } from "@pinia/testing";

import type { RenderResult } from "@testing-library/vue";
import type { Router } from "vue-router";

import LobbyPage from "@/pages/LobbyPage/LobbyPage.vue";

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

const renderPage = async (): Promise<RenderResult> => {
  const router = createTestRouter();
  await router.push("/lobby");
  await router.isReady();

  return render(LobbyPage, {
    global: {
      plugins: [
        createTestingPinia({
          createSpy: vi.fn,
          initialState: {
            user: { id: "user-1", username: "TestUser", actualRoom: "" },
            lobby: { id: "lobby_room", rooms: {}, users: [], appTotalPlayers: 0 },
          },
        }),
        router,
      ],
      stubs: { Mobile: true },
    },
  });
};

describe("LobbyPage", () => {
  beforeEach(() => {
    mockSocket.__reset();
  });

  it("should emit JOIN_LOBBY on mount", async () => {
    await renderPage();

    expect(mockSocket.emit).toHaveBeenCalledWith("join lobby", expect.any(Function));
  });

  it("should register listener for UPDATE_LOBBY on mount", async () => {
    await renderPage();

    expect(mockSocket.on).toHaveBeenCalledWith("update lobby", expect.any(Function));
  });

  it("should render lobby sections", async () => {
    await renderPage();

    expect(screen.getByText(/Rooms:/)).toBeTruthy();
  });
});
