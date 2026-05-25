import { render, screen } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import { createTestingPinia } from "@pinia/testing";

import type { RenderResult } from "@testing-library/vue";
import type { Player } from "@/types/app";

import SectionLobbyRoom from "@/components/Sections/SectionLobbyRoom/SectionLobbyRoom.vue";

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
  stateOverrides: {
    room?: Record<string, unknown>;
    user?: Record<string, unknown>;
  } = {}
): RenderResult => {
  return render(SectionLobbyRoom, {
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
                rounds: { actualRound: 1, totalRounds: 1 },
                slots: 6,
                type: "public",
                countdown: { countdownSelected: 90, countdownGame: 90 },
              },
              owner: {
                id: "owner-1",
                username: "Owner",
                actualRoom: "room-1",
              },
              players: [
                createMockPlayer({ id: "owner-1", username: "Owner" }),
                createMockPlayer({ id: "player-2", username: "Player2" }),
              ],
              started: false,
              wordToGuess: {
                actualWord: "",
                wordsToChoose: [],
                wordWithPlaceholder: "",
              },
              ...stateOverrides.room,
            },
            user: {
              id: "owner-1",
              username: "Owner",
              actualRoom: "room-1",
              ...stateOverrides.user,
            },
          },
        }),
      ],
      stubs: { "v-icon": true },
    },
  });
};

describe("SectionLobbyRoom", () => {
  beforeEach(() => {
    mockSocket.__reset();
  });

  it("should render the room information section", () => {
    renderComponent();

    expect(screen.getByText("room-1")).toBeTruthy();
  });

  it("should show start button when user is the room owner", () => {
    renderComponent();

    expect(screen.getByRole("button", { name: /Start Game/i })).toBeTruthy();
  });

  it("should not show start button when user is not the owner", () => {
    renderComponent({
      user: { id: "not-owner", username: "NotOwner", actualRoom: "room-1" },
    });

    expect(screen.queryByRole("button", { name: /Start Game/i })).toBeNull();
    expect(screen.queryByRole("button", { name: /Waiting for more players/i })).toBeNull();
  });

  it("should show Waiting for more players when only 1 player", () => {
    renderComponent({
      room: {
        players: [createMockPlayer({ id: "owner-1", username: "Owner" })],
      },
    });

    expect(screen.getByRole("button", { name: "Waiting for more players..." })).toBeTruthy();
  });

  it("should show Start Game when 2 or more players", () => {
    renderComponent({
      room: {
        players: [
          createMockPlayer({ id: "owner-1", username: "Owner" }),
          createMockPlayer({ id: "player-2", username: "Player2" }),
        ],
      },
    });

    expect(screen.getByRole("button", { name: /Start Game/i })).toBeTruthy();
  });

  it("should emit START_GAME socket event when start button is clicked", async () => {
    const user = userEvent.setup();
    renderComponent({
      room: {
        players: [
          createMockPlayer({ id: "owner-1", username: "Owner" }),
          createMockPlayer({ id: "player-2", username: "Player2" }),
        ],
      },
    });

    await user.click(screen.getByRole("button", { name: /Start Game/i }));

    expect(mockSocket.emit).toHaveBeenCalledWith("start game", "room-1");
  });

  it("should disable the start button when only 1 player", () => {
    renderComponent({
      room: {
        players: [createMockPlayer({ id: "owner-1", username: "Owner" })],
      },
    });

    const button = screen.getByRole("button", {
      name: "Waiting for more players...",
    });

    expect(button).toHaveAttribute("disabled");
  });
});
