import { render, screen } from "@testing-library/vue";
import { createMemoryHistory, createRouter } from "vue-router";
import { createTestingPinia } from "@pinia/testing";

import type { RenderResult } from "@testing-library/vue";
import type { Router } from "vue-router";

import CreateRoomPage from "@/pages/CreateRoomPage/CreateRoomPage.vue";

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
  await router.push("/room/create");
  await router.isReady();

  return render(CreateRoomPage, {
    global: {
      plugins: [
        createTestingPinia({
          createSpy: vi.fn,
          initialState: {
            user: { id: "user-1", username: "TestUser", actualRoom: "" },
          },
        }),
        router,
      ],
      stubs: { Mobile: true },
    },
  });
};

describe("CreateRoomPage", () => {
  beforeEach(() => {
    mockSocket.__reset();
  });

  it("should render the create room form", async () => {
    await renderPage();

    expect(screen.getByText("¡Create room!")).toBeTruthy();
  });
});
