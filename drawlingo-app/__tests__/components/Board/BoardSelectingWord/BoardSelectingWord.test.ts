import { render, screen } from "@testing-library/vue";
import { createTestingPinia } from "@pinia/testing";

import type { RenderResult } from "@testing-library/vue";
import type { Player } from "@/types/app";

import BoardSelectingWord from "@/components/Board/BoardSelectingWord/BoardSelectingWord.vue";

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
  return render(BoardSelectingWord, {
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

describe("BoardSelectingWord", () => {
  it("should render the choosing player username with the message", () => {
    renderComponent([
      createMockPlayer({
        id: "p1",
        username: "Alice",
        choosingAWord: true,
      }),
      createMockPlayer({ id: "p2", username: "Bob" }),
    ]);

    expect(screen.getByText("Alice is choosing a word to paint")).toBeTruthy();
  });

  it("should render another player username when they are choosing", () => {
    renderComponent([
      createMockPlayer({ id: "p1", username: "Alice" }),
      createMockPlayer({
        id: "p2",
        username: "Bob",
        choosingAWord: true,
      }),
    ]);

    expect(screen.getByText("Bob is choosing a word to paint")).toBeTruthy();
  });

  it("should render message without username when no player is choosing", () => {
    renderComponent([createMockPlayer({ id: "p1", username: "Alice" })]);

    expect(screen.getByText("is choosing a word to paint")).toBeTruthy();
  });
});
