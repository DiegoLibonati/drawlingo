import { render, screen } from "@testing-library/vue";
import { createTestingPinia } from "@pinia/testing";

import type { RenderResult } from "@testing-library/vue";
import type { Player } from "@/types/app";

import ArticleGamePlayers from "@/components/Articles/ArticleGamePlayers/ArticleGamePlayers.vue";

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
  return render(ArticleGamePlayers, {
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
            user: {
              id: "player-1",
              username: "TestPlayer",
              actualRoom: "room-1",
            },
          },
        }),
      ],
    },
  });
};

describe("ArticleGamePlayers", () => {
  it("should render player usernames", () => {
    renderComponent([
      createMockPlayer({ id: "p1", username: "Alice", score: 100 }),
      createMockPlayer({ id: "p2", username: "Bob", score: 200 }),
    ]);

    expect(screen.getByText("Alice")).toBeTruthy();
    expect(screen.getByText("Bob")).toBeTruthy();
  });

  it("should render player scores", () => {
    renderComponent([
      createMockPlayer({ id: "p1", username: "Alice", score: 150 }),
      createMockPlayer({ id: "p2", username: "Bob", score: 300 }),
    ]);

    expect(screen.getByText("150")).toBeTruthy();
    expect(screen.getByText("300")).toBeTruthy();
  });

  it("should render position numbers for each player", () => {
    renderComponent([
      createMockPlayer({ id: "p1", username: "Alice", score: 300 }),
      createMockPlayer({ id: "p2", username: "Bob", score: 100 }),
    ]);

    expect(screen.getByText("1")).toBeTruthy();
    expect(screen.getByText("2")).toBeTruthy();
  });

  it("should render players sorted by score with highest first", () => {
    const { container } = renderComponent([
      createMockPlayer({ id: "p1", username: "LowScore", score: 50 }),
      createMockPlayer({ id: "p2", username: "HighScore", score: 300 }),
      createMockPlayer({ id: "p3", username: "MidScore", score: 150 }),
    ]);

    const playerCards = container.querySelectorAll<HTMLDivElement>("article > div");
    expect(playerCards[0]).toHaveTextContent("HighScore");
    expect(playerCards[1]).toHaveTextContent("MidScore");
    expect(playerCards[2]).toHaveTextContent("LowScore");
  });

  it("should render no player cards when players array is empty", () => {
    const { container } = renderComponent([]);

    const article = container.querySelector<HTMLElement>("article");
    expect(article?.children.length).toBe(0);
  });
});
