import { render, screen } from "@testing-library/vue";
import { createTestingPinia } from "@pinia/testing";
import { vi } from "vitest";

import type { RenderResult } from "@testing-library/vue";
import type { Player } from "@/types/app";

import ArticleGameCanvas from "@/components/Articles/ArticleGameCanvas/ArticleGameCanvas.vue";

import { mockSocket } from "@tests/__mocks__/socket.mock";

vi.mock("@/socket", async () => {
  const { mockSocket } = await import("@tests/__mocks__/socket.mock");
  return { default: mockSocket };
});

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

const renderComponent = (
  overrides: {
    userId?: string;
    actualWord?: string;
    players?: Player[];
  } = {}
): RenderResult => {
  const { userId = "user-1", actualWord = "", players = [] } = overrides;

  return render(ArticleGameCanvas, {
    global: {
      plugins: [
        createTestingPinia({
          createSpy: vi.fn,
          initialState: {
            user: {
              id: userId,
              username: "TestUser",
              actualRoom: "room-1",
            },
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
              started: true,
              wordToGuess: {
                actualWord: actualWord,
                wordsToChoose: ["apple", "banana", "cherry"],
                wordWithPlaceholder: "",
              },
            },
            canvas: {
              canDraw: false,
              pos: { x: 0, y: 0 },
              color: "#000",
              size: 0.1,
              canvas: null,
            },
          },
        }),
      ],
    },
  });
};

describe("ArticleGameCanvas", () => {
  beforeEach(() => {
    mockSocket.__reset();
  });

  it("should render the article element", () => {
    const { container } = renderComponent();

    const article = container.querySelector<HTMLElement>("article");
    expect(article).toBeTruthy();
  });

  it("should render BoardSelectingWord when another player is choosing a word", () => {
    renderComponent({
      userId: "user-1",
      actualWord: "",
      players: [
        createMockPlayer({ id: "other-player", username: "Alice", choosingAWord: true }),
        createMockPlayer({ id: "user-1", username: "TestUser" }),
      ],
    });

    expect(screen.getByText("Alice is choosing a word to paint")).toBeTruthy();
  });

  it("should render BoardSelectWord when the current user is choosing a word", () => {
    renderComponent({
      userId: "user-1",
      actualWord: "",
      players: [createMockPlayer({ id: "user-1", username: "TestUser", choosingAWord: true })],
    });

    expect(screen.getByText("Select a word to paint")).toBeTruthy();
  });

  it("should render BoardCanvas when actualWord is set", () => {
    renderComponent({
      userId: "user-1",
      actualWord: "house",
      players: [createMockPlayer({ id: "painter-1", username: "Painter", isPainting: true })],
    });

    const canvas = document.querySelector<HTMLCanvasElement>("canvas");
    expect(canvas).toBeTruthy();
  });

  it("should not render BoardSelectWord when another player is choosing", () => {
    renderComponent({
      userId: "user-1",
      actualWord: "",
      players: [createMockPlayer({ id: "other-player", username: "Alice", choosingAWord: true })],
    });

    expect(screen.queryByText("Select a word to paint")).toBeNull();
  });

  it("should not render BoardSelectingWord when the current user is choosing", () => {
    renderComponent({
      userId: "user-1",
      actualWord: "",
      players: [createMockPlayer({ id: "user-1", username: "TestUser", choosingAWord: true })],
    });

    expect(screen.queryByText(/is choosing a word to paint/)).toBeNull();
  });
});
