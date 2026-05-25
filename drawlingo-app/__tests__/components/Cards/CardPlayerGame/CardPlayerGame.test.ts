import { render, screen } from "@testing-library/vue";
import { createTestingPinia } from "@pinia/testing";

import type { RenderResult } from "@testing-library/vue";
import type { Player } from "@/types/app";

import CardPlayerGame from "@/components/Cards/CardPlayerGame/CardPlayerGame.vue";

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
  props: { position: number; player: Player },
  userId = "current-user"
): RenderResult => {
  return render(CardPlayerGame, {
    props,
    global: {
      plugins: [
        createTestingPinia({
          createSpy: vi.fn,
          initialState: {
            user: {
              id: userId,
              username: "CurrentUser",
              actualRoom: "room-1",
            },
          },
        }),
      ],
    },
  });
};

describe("CardPlayerGame", () => {
  it("should render the position number", () => {
    renderComponent({
      position: 3,
      player: createMockPlayer(),
    });

    expect(screen.getByText("3")).toBeTruthy();
  });

  it("should render the player username", () => {
    renderComponent({
      position: 1,
      player: createMockPlayer({ username: "Alice" }),
    });

    expect(screen.getByText("Alice")).toBeTruthy();
  });

  it("should render the player score", () => {
    renderComponent({
      position: 1,
      player: createMockPlayer({ score: 250 }),
    });

    expect(screen.getByText("250")).toBeTruthy();
  });

  it("should show player painting image when isPainting is true", () => {
    renderComponent({
      position: 1,
      player: createMockPlayer({ isPainting: true, alreadyPainted: false }),
    });

    expect(screen.getByAltText("player painting")).toBeTruthy();
  });

  it("should show player painted image when alreadyPainted is true", () => {
    renderComponent({
      position: 1,
      player: createMockPlayer({ isPainting: false, alreadyPainted: true }),
    });

    const img = screen.getByAltText("player painted");
    expect(img).toBeTruthy();
    expect(img).not.toHaveClass("grayscale");
  });

  it("should show grayscale image when not painting and not already painted", () => {
    renderComponent({
      position: 1,
      player: createMockPlayer({ isPainting: false, alreadyPainted: false }),
    });

    const img = screen.getByAltText("player painted");
    expect(img).toHaveClass("grayscale");
  });

  it("should show star image when player has guessed", () => {
    renderComponent({
      position: 1,
      player: createMockPlayer({ guessed: true }),
    });

    expect(screen.getByAltText("star guess")).toBeTruthy();
  });

  it("should not show star image when player has not guessed", () => {
    renderComponent({
      position: 1,
      player: createMockPlayer({ guessed: false }),
    });

    expect(screen.queryByAltText("star guess")).toBeNull();
  });

  it("should highlight username with tertiary color when player is the current user", () => {
    const player = createMockPlayer({ id: "current-user", username: "Me" });

    renderComponent({ position: 1, player }, "current-user");

    const username = screen.getByText("Me");
    expect(username).toHaveClass("text-tertiary");
  });

  it("should not highlight username when player is not the current user", () => {
    const player = createMockPlayer({ id: "other-user", username: "Other" });

    renderComponent({ position: 1, player }, "current-user");

    const username = screen.getByText("Other");
    expect(username).toHaveClass("text-white");
    expect(username).not.toHaveClass("text-tertiary");
  });
});
