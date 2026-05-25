import { render, screen } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import { createTestingPinia } from "@pinia/testing";

import type { RenderResult } from "@testing-library/vue";

import FormChatGame from "@/components/Forms/FormChatGame/FormChatGame.vue";

import { mockSocket } from "@tests/__mocks__/socket.mock";

vi.mock("@/socket", async () => {
  const { mockSocket } = await import("@tests/__mocks__/socket.mock");
  return { default: mockSocket };
});

const renderComponent = (roomState: Record<string, unknown> = {}): RenderResult => {
  return render(FormChatGame, {
    global: {
      plugins: [
        createTestingPinia({
          createSpy: vi.fn,
          initialState: {
            room: {
              id: "room-123",
              configuration: {
                name: "Test Room",
                password: "",
                rounds: { actualRound: 1, totalRounds: 1 },
                slots: 6,
                type: "public",
                countdown: { countdownSelected: 90, countdownGame: 90 },
              },
              owner: { id: "owner-1", username: "Owner", actualRoom: "room-123" },
              players: [],
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

describe("FormChatGame", () => {
  beforeEach(() => {
    mockSocket.__reset();
  });

  it("should render the message input and send button", () => {
    renderComponent();

    expect(screen.getByPlaceholderText("Enter a message..")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Send" })).toBeTruthy();
  });

  it("should emit socket event with message and room id on submit", async () => {
    const user = userEvent.setup();
    renderComponent();

    const input = screen.getByPlaceholderText("Enter a message..");
    await user.clear(input);
    await user.type(input, "Hello world");
    await user.click(screen.getByRole("button", { name: "Send" }));

    expect(mockSocket.emit).toHaveBeenCalledWith("send message game", {
      idRoom: "room-123",
      message: "Hello world",
    });
  });

  it("should reset the form after a successful submit", async () => {
    const user = userEvent.setup();
    renderComponent();

    const input = screen.getByPlaceholderText<HTMLInputElement>("Enter a message..");
    await user.clear(input);
    await user.type(input, "Hello");
    await user.click(screen.getByRole("button", { name: "Send" }));

    expect(input.value).toBe("");
  });

  it("should not emit socket event when message is empty", async () => {
    const user = userEvent.setup();
    renderComponent();

    const input = screen.getByPlaceholderText("Enter a message..");
    await user.clear(input);
    await user.click(screen.getByRole("button", { name: "Send" }));

    expect(mockSocket.emit).not.toHaveBeenCalled();
  });

  it("should not emit socket event when message is only whitespace", async () => {
    const user = userEvent.setup();
    renderComponent();

    const input = screen.getByPlaceholderText("Enter a message..");
    await user.clear(input);
    await user.type(input, "   ");
    await user.click(screen.getByRole("button", { name: "Send" }));

    expect(mockSocket.emit).not.toHaveBeenCalled();
  });
});
