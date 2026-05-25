import { render, screen, waitFor } from "@testing-library/vue";
import { createTestingPinia } from "@pinia/testing";
import { vi } from "vitest";

import type { RenderResult } from "@testing-library/vue";
import type { Message } from "@/types/app";

import ChatGame from "@/components/Chats/ChatGame/ChatGame.vue";

import { mockSocket } from "@tests/__mocks__/socket.mock";

vi.mock("@/socket", async () => {
  const { mockSocket } = await import("@tests/__mocks__/socket.mock");
  return { default: mockSocket };
});

const renderComponent = (
  overrides: {
    userId?: string;
    roomId?: string;
    countdownGame?: number;
  } = {}
): RenderResult => {
  const { userId = "user-1", roomId = "room-1", countdownGame = 60 } = overrides;

  return render(ChatGame, {
    global: {
      plugins: [
        createTestingPinia({
          createSpy: vi.fn,
          initialState: {
            user: {
              id: userId,
              username: "TestUser",
              actualRoom: roomId,
            },
            room: {
              id: roomId,
              configuration: {
                name: "",
                password: "",
                rounds: { actualRound: 1, totalRounds: 1 },
                slots: 6,
                type: "public",
                countdown: { countdownSelected: 90, countdownGame: countdownGame },
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

const createMockMessage = (overrides: Partial<Message> = {}): Message => ({
  id: "msg-1",
  user: { id: "user-2", username: "OtherUser", actualRoom: "room-1" },
  message: "Hello",
  ...overrides,
});

describe("ChatGame", () => {
  beforeEach(() => {
    mockSocket.__reset();
    mockSocket.on.mockImplementation((event: string, listener: (...args: unknown[]) => void) => {
      if (!mockSocket.__listeners.has(event)) mockSocket.__listeners.set(event, new Set());
      mockSocket.__listeners.get(event)!.add(listener);
      return mockSocket;
    });
    mockSocket.off.mockImplementation((event: string, listener?: (...args: unknown[]) => void) => {
      if (!listener) mockSocket.__listeners.delete(event);
      else mockSocket.__listeners.get(event)?.delete(listener);
      return mockSocket;
    });
    vi.stubGlobal(
      "Audio",
      vi.fn().mockImplementation(() => ({ play: vi.fn().mockResolvedValue(undefined) }))
    );
  });

  it("should register a listener for SEND_MESSAGE_GAME on mount", () => {
    renderComponent();

    expect(mockSocket.on).toHaveBeenCalledWith("send message game", expect.any(Function));
  });

  it("should render a message when the server emits a non-success message", async () => {
    renderComponent();

    const message = createMockMessage({
      id: "msg-1",
      user: { id: "user-2", username: "Alice", actualRoom: "room-1" },
      message: "test message",
      success: false,
    });

    mockSocket.__serverEmit("send message game", message);

    await waitFor(() => {
      expect(screen.getByText(/test message/)).toBeTruthy();
    });
  });

  it("should render multiple messages when the server emits them", async () => {
    renderComponent();

    mockSocket.__serverEmit(
      "send message game",
      createMockMessage({
        id: "msg-1",
        user: { id: "user-2", username: "Alice", actualRoom: "room-1" },
        message: "first message",
      })
    );

    mockSocket.__serverEmit(
      "send message game",
      createMockMessage({
        id: "msg-2",
        user: { id: "user-3", username: "Bob", actualRoom: "room-1" },
        message: "second message",
      })
    );

    await waitFor(() => {
      expect(screen.getByText(/first message/)).toBeTruthy();
      expect(screen.getByText(/second message/)).toBeTruthy();
    });
  });

  it("should not render a success message as a chat message", () => {
    renderComponent({ userId: "user-2" });

    const message = createMockMessage({
      id: "msg-1",
      user: { id: "user-2", username: "TestUser", actualRoom: "room-1" },
      message: "guessed correctly",
      success: true,
    });

    mockSocket.__serverEmit("send message game", message);

    expect(screen.queryByText(/guessed correctly/)).toBeNull();
  });

  it("should unregister the listener on unmount", () => {
    const { unmount } = renderComponent();

    unmount();

    expect(mockSocket.off).toHaveBeenCalledWith("send message game");
  });

  it("should render the FormChatGame component", () => {
    renderComponent();

    expect(screen.getByText("Send")).toBeTruthy();
  });
});
