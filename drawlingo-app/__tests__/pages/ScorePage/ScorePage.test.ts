import { render, screen } from "@testing-library/vue";
import { createMemoryHistory, createRouter } from "vue-router";
import { createTestingPinia } from "@pinia/testing";

import type { RenderResult } from "@testing-library/vue";
import type { Router } from "vue-router";

import ScorePage from "@/pages/ScorePage/ScorePage.vue";

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
  await router.push("/score");
  await router.isReady();

  return render(ScorePage, {
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
                rounds: { actualRound: 3, totalRounds: 3 },
                slots: 6,
                type: "public",
                countdown: { countdownSelected: 90, countdownGame: 90 },
              },
              owner: { id: "owner-1", username: "Owner", actualRoom: "room-1" },
              players: [
                {
                  id: "player-1",
                  username: "Alice",
                  actualRoom: "room-1",
                  isPainting: false,
                  alreadyPainted: false,
                  choosingAWord: false,
                  score: 100,
                  guessed: false,
                },
                {
                  id: "player-2",
                  username: "Bob",
                  actualRoom: "room-1",
                  isPainting: false,
                  alreadyPainted: false,
                  choosingAWord: false,
                  score: 50,
                  guessed: false,
                },
              ],
              started: false,
              wordToGuess: { actualWord: "", wordsToChoose: [], wordWithPlaceholder: "" },
            },
            alert: { type: "", message: "" },
          },
        }),
        router,
      ],
      stubs: { Mobile: true },
    },
  });
};

describe("ScorePage", () => {
  beforeEach(() => {
    mockSocket.__reset();
  });

  it("should render the Final Standings heading", async () => {
    await renderPage();

    expect(screen.getByText("Final Standings")).toBeTruthy();
  });

  it("should register listener for UPDATE_GAME on mount", async () => {
    await renderPage();

    expect(mockSocket.on).toHaveBeenCalledWith("update game", expect.any(Function));
  });

  it("should register listener for DISCONNECT on mount", async () => {
    await renderPage();

    expect(mockSocket.on).toHaveBeenCalledWith("custom disconnect", expect.any(Function));
  });

  it("should unregister listeners on unmount", async () => {
    const { unmount } = await renderPage();

    unmount();

    expect(mockSocket.off).toHaveBeenCalledWith("update game");
    expect(mockSocket.off).toHaveBeenCalledWith("custom disconnect");
  });
});
