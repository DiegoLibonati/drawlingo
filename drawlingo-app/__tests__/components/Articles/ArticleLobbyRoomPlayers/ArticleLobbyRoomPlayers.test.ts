import { render, screen } from "@testing-library/vue";
import { createTestingPinia } from "@pinia/testing";

import type { RenderResult } from "@testing-library/vue";
import type { Player } from "@/types/app";

import ArticleLobbyRoomPlayers from "@/components/Articles/ArticleLobbyRoomPlayers/ArticleLobbyRoomPlayers.vue";

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

const renderComponent = (roomState: Record<string, unknown> = {}): RenderResult => {
  return render(ArticleLobbyRoomPlayers, {
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
              owner: {
                id: "player-1",
                username: "Alice",
                actualRoom: "room-1",
              },
              players: [
                createMockPlayer({ id: "player-1", username: "Alice" }),
                createMockPlayer({ id: "player-2", username: "Bob" }),
              ],
              started: false,
              wordToGuess: {
                actualWord: "",
                wordsToChoose: [],
                wordWithPlaceholder: "",
              },
              ...roomState,
            },
          },
        }),
      ],
      stubs: { "v-icon": true },
    },
  });
};

describe("ArticleLobbyRoomPlayers", () => {
  it("should render all player usernames", () => {
    renderComponent();

    expect(screen.getByText("Alice")).toBeTruthy();
    expect(screen.getByText("Bob")).toBeTruthy();
  });

  it("should render the crown icon for the room owner", () => {
    const { container } = renderComponent();

    const iconStubs = container.querySelectorAll<HTMLElement>("v-icon-stub");
    expect(iconStubs.length).toBe(1);
  });

  it("should not render crown icon for non-owner players", () => {
    renderComponent({
      owner: {
        id: "player-1",
        username: "Alice",
        actualRoom: "room-1",
      },
      players: [
        createMockPlayer({ id: "player-2", username: "Bob" }),
        createMockPlayer({ id: "player-3", username: "Charlie" }),
      ],
    });

    const { container } = renderComponent({
      owner: {
        id: "nobody",
        username: "Nobody",
        actualRoom: "room-1",
      },
      players: [createMockPlayer({ id: "player-2", username: "Bob" })],
    });

    const iconStubs = container.querySelectorAll<HTMLElement>("v-icon-stub");
    expect(iconStubs.length).toBe(0);
  });

  it("should render players in order", () => {
    renderComponent({
      players: [
        createMockPlayer({ id: "player-1", username: "First" }),
        createMockPlayer({ id: "player-2", username: "Second" }),
        createMockPlayer({ id: "player-3", username: "Third" }),
      ],
    });

    const playerNames = screen.getAllByRole("heading", { level: 2 });
    expect(playerNames[0]).toHaveTextContent("First");
    expect(playerNames[1]).toHaveTextContent("Second");
    expect(playerNames[2]).toHaveTextContent("Third");
  });
});
