import { render, screen } from "@testing-library/vue";

import type { RenderResult } from "@testing-library/vue";
import type { Player } from "@/types/app";

import CardPlayerScore from "@/components/Cards/CardPlayerScore/CardPlayerScore.vue";

const createPlayer = (overrides: Partial<Player> = {}): Player => ({
  id: "1",
  username: "TestPlayer",
  actualRoom: "room-1",
  isPainting: false,
  alreadyPainted: false,
  choosingAWord: false,
  score: 150,
  guessed: false,
  ...overrides,
});

const renderComponent = (props: { position: number; player: Player }): RenderResult => {
  return render(CardPlayerScore, { props });
};

describe("CardPlayerScore", () => {
  it("should render the position", () => {
    renderComponent({ position: 1, player: createPlayer() });

    expect(screen.getByText("1")).toBeTruthy();
  });

  it("should render the player username", () => {
    renderComponent({
      position: 1,
      player: createPlayer({ username: "Alice" }),
    });

    expect(screen.getByText("Alice")).toBeTruthy();
  });

  it("should render the score with Points text", () => {
    renderComponent({
      position: 1,
      player: createPlayer({ score: 200 }),
    });

    expect(screen.getByText("200 Points")).toBeTruthy();
  });

  it("should apply green background for position 1", () => {
    const { container } = renderComponent({
      position: 1,
      player: createPlayer(),
    });

    const card = container.firstElementChild as HTMLElement;

    expect(card).toHaveClass("bg-green-500");
  });

  it("should apply yellow background for position 2", () => {
    const { container } = renderComponent({
      position: 2,
      player: createPlayer(),
    });

    const card = container.firstElementChild as HTMLElement;

    expect(card).toHaveClass("bg-yellow-500");
  });

  it("should apply red background for position 3 or higher", () => {
    const { container } = renderComponent({
      position: 3,
      player: createPlayer(),
    });

    const card = container.firstElementChild as HTMLElement;

    expect(card).toHaveClass("bg-red-500");
  });
});
