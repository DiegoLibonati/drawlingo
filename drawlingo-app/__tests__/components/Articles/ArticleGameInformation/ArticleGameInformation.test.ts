import { render, screen } from "@testing-library/vue";
import { createTestingPinia } from "@pinia/testing";

import type { RenderResult } from "@testing-library/vue";
import type { Player } from "@/types/app";

import ArticleGameInformation from "@/components/Articles/ArticleGameInformation/ArticleGameInformation.vue";

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
  return render(ArticleGameInformation, {
    global: {
      plugins: [
        createTestingPinia({
          createSpy: vi.fn,
          initialState: {
            room: {
              id: "room-abc-123",
              configuration: {
                name: "Test Room",
                password: "",
                rounds: { actualRound: 2, totalRounds: 3 },
                slots: 6,
                type: "public",
                countdown: { countdownSelected: 90, countdownGame: 90 },
              },
              owner: {
                id: "owner-1",
                username: "OwnerPlayer",
                actualRoom: "room-abc-123",
              },
              players: [createMockPlayer()],
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
    },
  });
};

describe("ArticleGameInformation", () => {
  it("should render the room id", () => {
    renderComponent();

    expect(screen.getByText("room-abc-123")).toBeTruthy();
  });

  it("should render the rounds in actualRound/totalRounds format", () => {
    renderComponent();

    expect(screen.getByText("2/3")).toBeTruthy();
  });

  it("should render the owner username", () => {
    renderComponent();

    expect(screen.getByText("OwnerPlayer")).toBeTruthy();
  });

  it("should render Room ID heading", () => {
    renderComponent();

    expect(screen.getByText("Room ID")).toBeTruthy();
  });

  it("should render Rounds heading", () => {
    renderComponent();

    expect(screen.getByText("Rounds")).toBeTruthy();
  });

  it("should render Room Owner heading", () => {
    renderComponent();

    expect(screen.getByText("Room Owner")).toBeTruthy();
  });
});
