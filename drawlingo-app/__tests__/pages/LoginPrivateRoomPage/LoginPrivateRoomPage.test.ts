import { render, screen } from "@testing-library/vue";
import { createMemoryHistory, createRouter } from "vue-router";
import { createTestingPinia } from "@pinia/testing";

import type { RenderResult } from "@testing-library/vue";
import type { Router } from "vue-router";

import LoginPrivateRoomPage from "@/pages/LoginPrivateRoomPage/LoginPrivateRoomPage.vue";

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
  await router.push("/room/login/private");
  await router.isReady();

  return render(LoginPrivateRoomPage, {
    global: {
      plugins: [
        createTestingPinia({
          createSpy: vi.fn,
          initialState: {
            user: { id: "user-1", username: "TestUser", actualRoom: "" },
            alert: { type: "", message: "" },
          },
        }),
        router,
      ],
      stubs: { Mobile: true },
    },
  });
};

describe("LoginPrivateRoomPage", () => {
  beforeEach(() => {
    mockSocket.__reset();
  });

  it("should render the connect to a private room heading", async () => {
    await renderPage();

    expect(screen.getByText("Connect to a private room")).toBeTruthy();
  });
});
