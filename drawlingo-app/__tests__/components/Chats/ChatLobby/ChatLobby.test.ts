import { render, screen, waitFor } from "@testing-library/vue";
import { createTestingPinia } from "@pinia/testing";
import { vi } from "vitest";

import type { RenderResult } from "@testing-library/vue";
import type { Message } from "@/types/app";

import ChatLobby from "@/components/Chats/ChatLobby/ChatLobby.vue";

import { mockSocket } from "@tests/__mocks__/socket.mock";

vi.mock("@/socket", async () => {
  const { mockSocket } = await import("@tests/__mocks__/socket.mock");
  return { default: mockSocket };
});

const renderComponent = (userId = "user-1"): RenderResult => {
  return render(ChatLobby, {
    global: {
      plugins: [
        createTestingPinia({
          createSpy: vi.fn,
          initialState: {
            user: {
              id: userId,
              username: "TestUser",
              actualRoom: "",
            },
          },
        }),
      ],
    },
  });
};

const createMockMessage = (overrides: Partial<Message> = {}): Message => ({
  id: "msg-1",
  user: { id: "user-2", username: "OtherUser", actualRoom: "" },
  message: "Hello",
  ...overrides,
});

describe("ChatLobby", () => {
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
  });

  it("should register a listener for SEND_MESSAGE_LOBBY on mount", () => {
    renderComponent();

    expect(mockSocket.on).toHaveBeenCalledWith("send message lobby", expect.any(Function));
  });

  it("should render a message when the server emits one", async () => {
    renderComponent();

    const message = createMockMessage({
      id: "msg-1",
      user: { id: "user-2", username: "Alice", actualRoom: "" },
      message: "lobby message",
    });

    mockSocket.__serverEmit("send message lobby", message);

    await waitFor(() => {
      expect(screen.getByText(/lobby message/)).toBeTruthy();
    });
  });

  it("should render multiple messages when the server emits them", async () => {
    renderComponent();

    mockSocket.__serverEmit(
      "send message lobby",
      createMockMessage({
        id: "msg-1",
        user: { id: "user-2", username: "Alice", actualRoom: "" },
        message: "first lobby msg",
      })
    );

    mockSocket.__serverEmit(
      "send message lobby",
      createMockMessage({
        id: "msg-2",
        user: { id: "user-3", username: "Bob", actualRoom: "" },
        message: "second lobby msg",
      })
    );

    await waitFor(() => {
      expect(screen.getByText(/first lobby msg/)).toBeTruthy();
      expect(screen.getByText(/second lobby msg/)).toBeTruthy();
    });
  });

  it("should unregister the listener on unmount", () => {
    const { unmount } = renderComponent();

    unmount();

    expect(mockSocket.off).toHaveBeenCalledWith("send message lobby");
  });

  it("should render the FormChatLobby component", () => {
    renderComponent();

    expect(screen.getByText("Send")).toBeTruthy();
  });
});
