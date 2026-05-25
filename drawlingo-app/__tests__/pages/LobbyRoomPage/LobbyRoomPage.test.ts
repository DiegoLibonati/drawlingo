import { render } from "@testing-library/vue";
import { createMemoryHistory, createRouter } from "vue-router";
import { createTestingPinia } from "@pinia/testing";

import type { RenderResult } from "@testing-library/vue";
import type { Router } from "vue-router";

import LobbyRoomPage from "@/pages/LobbyRoomPage/LobbyRoomPage.vue";

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
  await router.push("/room/lobby/test-room-id");
  await router.isReady();

  return render(LobbyRoomPage, {
    global: {
      plugins: [
        createTestingPinia({
          createSpy: vi.fn,
          initialState: {
            room: {
              id: "test-room-id",
              configuration: {
                name: "Test Room",
                password: "",
                rounds: { actualRound: 1, totalRounds: 3 },
                slots: 6,
                type: "public",
                countdown: { countdownSelected: 90, countdownGame: 90 },
              },
              owner: { id: "owner-1", username: "Owner", actualRoom: "test-room-id" },
              players: [],
              started: false,
              wordToGuess: { actualWord: "", wordsToChoose: [], wordWithPlaceholder: "" },
            },
            user: { id: "user-1", username: "TestUser", actualRoom: "test-room-id" },
            alert: { type: "", message: "" },
          },
        }),
        router,
      ],
      stubs: { "v-icon": true, Mobile: true },
    },
  });
};

describe("LobbyRoomPage", () => {
  beforeEach(() => {
    mockSocket.__reset();
  });

  it("should emit JOIN_ROOM_LOBBY with route param id on mount", async () => {
    await renderPage();

    expect(mockSocket.emit).toHaveBeenCalledWith("join room lobby", "test-room-id");
  });

  it("should register listener for UPDATE_ROOM_LOBBY on mount", async () => {
    await renderPage();

    expect(mockSocket.on).toHaveBeenCalledWith("update room lobby", expect.any(Function));
  });

  it("should register listener for DISCONNECT on mount", async () => {
    await renderPage();

    expect(mockSocket.on).toHaveBeenCalledWith("custom disconnect", expect.any(Function));
  });

  it("should register listener for START_GAME on mount", async () => {
    await renderPage();

    expect(mockSocket.on).toHaveBeenCalledWith("start game", expect.any(Function));
  });
});
