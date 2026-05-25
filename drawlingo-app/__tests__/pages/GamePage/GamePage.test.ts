import { render } from "@testing-library/vue";
import { createMemoryHistory, createRouter } from "vue-router";
import { createTestingPinia } from "@pinia/testing";

import type { RenderResult } from "@testing-library/vue";
import type { Router } from "vue-router";

import GamePage from "@/pages/GamePage/GamePage.vue";

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
  await router.push("/game");
  await router.isReady();

  return render(GamePage, {
    global: {
      plugins: [
        createTestingPinia({
          createSpy: vi.fn,
          initialState: {
            room: {
              id: "room-1",
              configuration: {
                name: "Test Room",
                password: "",
                rounds: { actualRound: 1, totalRounds: 3 },
                slots: 6,
                type: "public",
                countdown: { countdownSelected: 90, countdownGame: 90 },
              },
              owner: { id: "owner-1", username: "Owner", actualRoom: "room-1" },
              players: [],
              started: true,
              wordToGuess: { actualWord: "", wordsToChoose: [], wordWithPlaceholder: "" },
            },
            user: { id: "user-1", username: "TestUser", actualRoom: "room-1" },
            canvas: { canDraw: false, pos: { x: 0, y: 0 }, color: "#000", size: 0.1, canvas: null },
            alert: { type: "", message: "" },
          },
        }),
        router,
      ],
      stubs: { Mobile: true, SectionGame: true },
    },
  });
};

describe("GamePage", () => {
  beforeEach(() => {
    mockSocket.__reset();
  });

  it("should emit JOIN_GAME on mount", async () => {
    await renderPage();

    expect(mockSocket.emit).toHaveBeenCalledWith("join game", "room-1");
  });

  it("should register listener for UPDATE_GAME on mount", async () => {
    await renderPage();

    expect(mockSocket.on).toHaveBeenCalledWith("update game", expect.any(Function));
  });

  it("should register listener for CANVAS_IMAGE_GAME on mount", async () => {
    await renderPage();

    expect(mockSocket.on).toHaveBeenCalledWith("canvas image game", expect.any(Function));
  });

  it("should register listener for CANVAS_CLEAR_GAME on mount", async () => {
    await renderPage();

    expect(mockSocket.on).toHaveBeenCalledWith("canvas clear game", expect.any(Function));
  });

  it("should register listener for DISCONNECT on mount", async () => {
    await renderPage();

    expect(mockSocket.on).toHaveBeenCalledWith("custom disconnect", expect.any(Function));
  });

  it("should register listener for NEW_PAINTER_GAME on mount", async () => {
    await renderPage();

    expect(mockSocket.on).toHaveBeenCalledWith("new painter game", expect.any(Function));
  });

  it("should register listener for NEXT_ROUND_GAME on mount", async () => {
    await renderPage();

    expect(mockSocket.on).toHaveBeenCalledWith("next round game", expect.any(Function));
  });

  it("should register listener for FINISH_GAME on mount", async () => {
    await renderPage();

    expect(mockSocket.on).toHaveBeenCalledWith("finish game", expect.any(Function));
  });

  it("should unregister all listeners on unmount", async () => {
    const { unmount } = await renderPage();

    unmount();

    expect(mockSocket.off).toHaveBeenCalledWith("update game");
    expect(mockSocket.off).toHaveBeenCalledWith("canvas image game");
    expect(mockSocket.off).toHaveBeenCalledWith("canvas clear game");
    expect(mockSocket.off).toHaveBeenCalledWith("custom disconnect");
    expect(mockSocket.off).toHaveBeenCalledWith("new painter game");
    expect(mockSocket.off).toHaveBeenCalledWith("next round game");
    expect(mockSocket.off).toHaveBeenCalledWith("finish game");
  });
});
