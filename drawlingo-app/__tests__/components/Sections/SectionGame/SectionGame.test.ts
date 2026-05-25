import { render } from "@testing-library/vue";
import { createTestingPinia } from "@pinia/testing";

import type { RenderResult } from "@testing-library/vue";

import SectionGame from "@/components/Sections/SectionGame/SectionGame.vue";

import { mockSocket } from "@tests/__mocks__/socket.mock";

vi.mock("@/socket", async () => {
  const { mockSocket } = await import("@tests/__mocks__/socket.mock");
  return { default: mockSocket };
});

const renderComponent = (): RenderResult => {
  return render(SectionGame, {
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
              players: [],
              started: false,
              wordToGuess: {
                actualWord: "",
                wordsToChoose: [],
                wordWithPlaceholder: "",
              },
            },
            user: {
              id: "user-1",
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

describe("SectionGame", () => {
  beforeEach(() => {
    mockSocket.__reset();
  });

  it("should render the section element", () => {
    const { container } = renderComponent();

    const section = container.querySelector<HTMLElement>("section");
    expect(section).toBeTruthy();
  });

  it("should render article elements for the game layout", () => {
    const { container } = renderComponent();

    const articles = container.querySelectorAll<HTMLElement>("article");
    expect(articles.length).toBeGreaterThanOrEqual(1);
  });
});
