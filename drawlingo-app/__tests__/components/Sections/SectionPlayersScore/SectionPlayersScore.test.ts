import { render, screen } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import { createTestingPinia } from "@pinia/testing";
import { createMemoryHistory, createRouter } from "vue-router";

import type { RenderResult } from "@testing-library/vue";
import type { Router } from "vue-router";

import SectionPlayersScore from "@/components/Sections/SectionPlayersScore/SectionPlayersScore.vue";

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

const renderComponent = async (initialRoute = "/score"): Promise<RenderResult> => {
  const router = createTestRouter();
  await router.push(initialRoute);
  await router.isReady();

  return render(SectionPlayersScore, {
    global: {
      plugins: [
        router,
        createTestingPinia({
          createSpy: vi.fn,
          initialState: {
            room: {
              id: "room-1",
              configuration: {
                name: "Test Room",
                password: "",
                rounds: { actualRound: 1, totalRounds: 1 },
                slots: 6,
                type: "public",
                countdown: { countdownSelected: 90, countdownGame: 90 },
              },
              owner: { id: "p1", username: "Alice", actualRoom: "room-1" },
              players: [
                {
                  id: "p1",
                  username: "Alice",
                  actualRoom: "room-1",
                  isPainting: false,
                  alreadyPainted: false,
                  choosingAWord: false,
                  score: 100,
                  guessed: false,
                },
              ],
              started: false,
              wordToGuess: {
                actualWord: "",
                wordsToChoose: [],
                wordWithPlaceholder: "",
              },
            },
          },
        }),
      ],
    },
  });
};

describe("SectionPlayersScore", () => {
  beforeEach(() => {
    mockSocket.__reset();
  });

  it("should render the Final Standings heading", async () => {
    await renderComponent();

    expect(screen.getByText("Final Standings")).toBeTruthy();
  });

  it("should render the Exit button", async () => {
    await renderComponent();

    expect(screen.getByRole("button", { name: "Exit" })).toBeTruthy();
  });

  it("should call socket.disconnect when Exit button is clicked", async () => {
    const user = userEvent.setup();
    const router = createTestRouter();
    await router.push("/score");
    await router.isReady();
    const pushSpy = vi.spyOn(router, "push");

    render(SectionPlayersScore, {
      global: {
        plugins: [
          router,
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              room: {
                id: "room-1",
                configuration: {
                  name: "Test Room",
                  password: "",
                  rounds: { actualRound: 1, totalRounds: 1 },
                  slots: 6,
                  type: "public",
                  countdown: { countdownSelected: 90, countdownGame: 90 },
                },
                owner: {
                  id: "p1",
                  username: "Alice",
                  actualRoom: "room-1",
                },
                players: [],
                started: false,
                wordToGuess: {
                  actualWord: "",
                  wordsToChoose: [],
                  wordWithPlaceholder: "",
                },
              },
            },
          }),
        ],
      },
    });

    await user.click(screen.getByRole("button", { name: "Exit" }));

    expect(mockSocket.disconnect).toHaveBeenCalledTimes(1);
    expect(pushSpy).toHaveBeenCalledWith("/");
  });
});
