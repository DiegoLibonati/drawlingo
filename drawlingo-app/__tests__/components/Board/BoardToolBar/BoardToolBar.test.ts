import { render, screen } from "@testing-library/vue";
import { createTestingPinia } from "@pinia/testing";
import { vi } from "vitest";

import type { RenderResult } from "@testing-library/vue";

import BoardToolBar from "@/components/Board/BoardToolBar/BoardToolBar.vue";

import { mockSocket } from "@tests/__mocks__/socket.mock";

vi.mock("@/socket", async () => {
  const { mockSocket } = await import("@tests/__mocks__/socket.mock");
  return { default: mockSocket };
});

const renderComponent = (): RenderResult => {
  return render(BoardToolBar, {
    global: {
      plugins: [
        createTestingPinia({
          createSpy: vi.fn,
          initialState: {
            canvas: {
              canDraw: false,
              pos: { x: 0, y: 0 },
              color: "#000",
              size: 0.1,
              canvas: null,
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
              players: [],
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

describe("BoardToolBar", () => {
  beforeEach(() => {
    mockSocket.__reset();
  });

  it("should render the color input", () => {
    const { container } = renderComponent();

    const colorInput = container.querySelector<HTMLInputElement>('input[type="color"]');
    expect(colorInput).toBeTruthy();
  });

  it("should render the range input", () => {
    const { container } = renderComponent();

    const rangeInput = container.querySelector<HTMLInputElement>('input[type="range"]');
    expect(rangeInput).toBeTruthy();
  });

  it("should render the Clear button", () => {
    renderComponent();

    expect(screen.getByText("Clear")).toBeTruthy();
  });
});
