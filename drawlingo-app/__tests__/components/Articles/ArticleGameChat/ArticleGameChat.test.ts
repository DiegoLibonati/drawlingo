import { render, screen } from "@testing-library/vue";
import { createTestingPinia } from "@pinia/testing";
import { vi } from "vitest";

import type { RenderResult } from "@testing-library/vue";

import ArticleGameChat from "@/components/Articles/ArticleGameChat/ArticleGameChat.vue";

import { mockSocket } from "@tests/__mocks__/socket.mock";

vi.mock("@/socket", async () => {
  const { mockSocket } = await import("@tests/__mocks__/socket.mock");
  return { default: mockSocket };
});

const renderComponent = (): RenderResult => {
  return render(ArticleGameChat, {
    global: {
      plugins: [
        createTestingPinia({
          createSpy: vi.fn,
          initialState: {
            user: { id: "user-1", username: "TestUser", actualRoom: "room-1" },
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
              wordToGuess: { actualWord: "", wordsToChoose: [], wordWithPlaceholder: "" },
            },
          },
        }),
      ],
    },
  });
};

describe("ArticleGameChat", () => {
  beforeEach(() => {
    mockSocket.__reset();
  });

  it("should render the article element", () => {
    const { container } = renderComponent();

    const article = container.querySelector<HTMLElement>("article");
    expect(article).toBeTruthy();
  });

  it("should render the ChatGame component with Send button", () => {
    renderComponent();

    expect(screen.getByText("Send")).toBeTruthy();
  });

  it("should render the message input", () => {
    renderComponent();

    expect(screen.getByPlaceholderText("Enter a message..")).toBeTruthy();
  });
});
