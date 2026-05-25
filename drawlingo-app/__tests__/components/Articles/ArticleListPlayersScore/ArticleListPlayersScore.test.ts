import { render, screen } from "@testing-library/vue";
import { createTestingPinia } from "@pinia/testing";

import type { RenderResult } from "@testing-library/vue";
import type { Player } from "@/types/app";

import ArticleListPlayersScore from "@/components/Articles/ArticleListPlayersScore/ArticleListPlayersScore.vue";

const createMockPlayer = (overrides: Partial<Player> = {}): Player => ({
  id: "player-1",
  username: "TestPlayer",
  actualRoom: "room-1",
  isPainting: false,
  alreadyPainted: false,
  choosingAWord: false,
  score: 0,
  guessed: false,
  ...overrides,
});

const renderComponent = (players: Player[] = []): RenderResult => {
  return render(ArticleListPlayersScore, {
    global: {
      plugins: [
        createTestingPinia({
          createSpy: vi.fn,
          initialState: {
            room: {
              id: "room-1",
              configuration: {
                name: "",
                password: "",
                rounds: { actualRound: 1, totalRounds: 1 },
                slots: 6,
                type: "public",
                countdown: { countdownSelected: 90, countdownGame: 90 },
              },
              owner: { id: "", username: "", actualRoom: "" },
              players: players,
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

describe("ArticleListPlayersScore", () => {
  it("should render players sorted by score with highest first", () => {
    renderComponent([
      createMockPlayer({ id: "p1", username: "LowScore", score: 50 }),
      createMockPlayer({ id: "p2", username: "HighScore", score: 300 }),
      createMockPlayer({ id: "p3", username: "MidScore", score: 150 }),
    ]);

    const usernames = screen.getAllByText(/Score/);
    expect(usernames[0]).toHaveTextContent("HighScore");
    expect(usernames[1]).toHaveTextContent("MidScore");
    expect(usernames[2]).toHaveTextContent("LowScore");
  });

  it("should render correct position numbers", () => {
    renderComponent([
      createMockPlayer({ id: "p1", username: "Alice", score: 200 }),
      createMockPlayer({ id: "p2", username: "Bob", score: 100 }),
    ]);

    expect(screen.getByText("1")).toBeTruthy();
    expect(screen.getByText("2")).toBeTruthy();
  });

  it("should render player scores with Points text", () => {
    renderComponent([createMockPlayer({ id: "p1", username: "Alice", score: 250 })]);

    expect(screen.getByText("250 Points")).toBeTruthy();
  });

  it("should render no player cards when players array is empty", () => {
    const { container } = renderComponent([]);

    const article = container.querySelector<HTMLElement>("article");
    expect(article?.children.length).toBe(0);
  });
});
