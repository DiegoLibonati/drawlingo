import { render, screen } from "@testing-library/vue";
import { createTestingPinia } from "@pinia/testing";
import { vi } from "vitest";

import type { RenderResult } from "@testing-library/vue";

import BoardCanvas from "@/components/Board/BoardCanvas/BoardCanvas.vue";

import { mockSocket } from "@tests/__mocks__/socket.mock";

vi.mock("@/socket", async () => {
  const { mockSocket } = await import("@tests/__mocks__/socket.mock");
  return { default: mockSocket };
});

const renderComponent = (
  overrides: {
    actualWord?: string;
    wordWithPlaceholder?: string;
    countdownGame?: number;
    painterId?: string;
    userId?: string;
  } = {}
): RenderResult => {
  const {
    actualWord = "house",
    wordWithPlaceholder = "h _ _ _ e",
    countdownGame = 60,
    painterId = "painter-1",
    userId = "user-1",
  } = overrides;

  return render(BoardCanvas, {
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
                countdown: { countdownSelected: 90, countdownGame: countdownGame },
              },
              owner: { id: "", username: "", actualRoom: "" },
              players: [
                {
                  id: painterId,
                  username: "Painter",
                  actualRoom: "room-1",
                  isPainting: true,
                  alreadyPainted: false,
                  choosingAWord: false,
                  score: 0,
                  guessed: false,
                },
              ],
              started: true,
              wordToGuess: {
                actualWord: actualWord,
                wordsToChoose: [],
                wordWithPlaceholder: wordWithPlaceholder,
              },
            },
            user: {
              id: userId,
              username: "TestUser",
              actualRoom: "room-1",
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

describe("BoardCanvas", () => {
  beforeEach(() => {
    mockSocket.__reset();
  });

  it("should render the canvas element", () => {
    const { container } = renderComponent();

    const canvas = container.querySelector<HTMLCanvasElement>("canvas");
    expect(canvas).toBeTruthy();
  });

  it("should render the countdown value", () => {
    renderComponent({ countdownGame: 45 });

    expect(screen.getByText("45")).toBeTruthy();
  });

  it("should show the actual word when the user is the painter", () => {
    renderComponent({
      actualWord: "house",
      wordWithPlaceholder: "h _ _ _ e",
      painterId: "user-1",
      userId: "user-1",
    });

    expect(screen.getByText("house")).toBeTruthy();
  });

  it("should show the placeholder when the user is not the painter", () => {
    renderComponent({
      actualWord: "house",
      wordWithPlaceholder: "h _ _ _ e",
      painterId: "painter-1",
      userId: "user-1",
    });

    expect(screen.getByText("h _ _ _ e")).toBeTruthy();
  });

  it("should render the word container", () => {
    const { container } = renderComponent();

    const wordContainer = container.querySelector<HTMLDivElement>('[data-testid="word-container"]');
    expect(wordContainer).toBeTruthy();
  });

  it("should render the toolbar when the user is the painter", () => {
    renderComponent({ painterId: "user-1", userId: "user-1" });

    expect(screen.getByText("Clear")).toBeTruthy();
  });

  it("should not render the toolbar when the user is not the painter", () => {
    renderComponent({ painterId: "painter-1", userId: "user-1" });

    expect(screen.queryByText("Clear")).toBeNull();
  });
});
