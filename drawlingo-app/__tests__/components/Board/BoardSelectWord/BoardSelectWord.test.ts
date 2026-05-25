import { render, screen } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import { createTestingPinia } from "@pinia/testing";
import { vi } from "vitest";

import type { RenderResult } from "@testing-library/vue";

import BoardSelectWord from "@/components/Board/BoardSelectWord/BoardSelectWord.vue";

import { mockSocket } from "@tests/__mocks__/socket.mock";

vi.mock("@/socket", async () => {
  const { mockSocket } = await import("@tests/__mocks__/socket.mock");
  return { default: mockSocket };
});

const renderComponent = (wordsToChoose: string[] = [], roomId = "room-1"): RenderResult => {
  return render(BoardSelectWord, {
    global: {
      plugins: [
        createTestingPinia({
          createSpy: vi.fn,
          initialState: {
            room: {
              id: roomId,
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
                wordsToChoose: wordsToChoose,
                wordWithPlaceholder: "",
              },
            },
          },
        }),
      ],
    },
  });
};

describe("BoardSelectWord", () => {
  beforeEach(() => {
    mockSocket.__reset();
  });

  it("should render the heading text", () => {
    renderComponent();

    expect(screen.getByText("Select a word to paint")).toBeTruthy();
  });

  it("should render a button for each word in wordsToChoose", () => {
    renderComponent(["apple", "banana", "cherry"]);

    expect(screen.getByText("apple")).toBeTruthy();
    expect(screen.getByText("banana")).toBeTruthy();
    expect(screen.getByText("cherry")).toBeTruthy();
  });

  it("should render no word buttons when wordsToChoose is empty", () => {
    const { container } = renderComponent([]);

    const buttons = container.querySelectorAll<HTMLButtonElement>("button");
    expect(buttons.length).toBe(0);
  });

  it("should emit WORD_SELECTED_GAME with correct payload when a word is clicked", async () => {
    const user = userEvent.setup();
    renderComponent(["apple", "banana", "cherry"], "room-42");

    await user.click(screen.getByText("banana"));

    expect(mockSocket.emit).toHaveBeenCalledWith("word selected game", {
      idRoom: "room-42",
      wordSelected: "banana",
    });
  });

  it("should emit WORD_SELECTED_GAME with the specific word that was clicked", async () => {
    const user = userEvent.setup();
    renderComponent(["cat", "dog"], "room-99");

    await user.click(screen.getByText("cat"));

    expect(mockSocket.emit).toHaveBeenCalledWith("word selected game", {
      idRoom: "room-99",
      wordSelected: "cat",
    });
  });
});
