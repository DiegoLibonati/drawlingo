import { render, screen } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";

import type { RenderResult } from "@testing-library/vue";

import FormChatLobby from "@/components/Forms/FormChatLobby/FormChatLobby.vue";

import { mockSocket } from "@tests/__mocks__/socket.mock";

vi.mock("@/socket", async () => {
  const { mockSocket } = await import("@tests/__mocks__/socket.mock");
  return { default: mockSocket };
});

const renderComponent = (): RenderResult => {
  return render(FormChatLobby);
};

describe("FormChatLobby", () => {
  beforeEach(() => {
    mockSocket.__reset();
  });

  it("should render the message input and send button", () => {
    renderComponent();

    expect(screen.getByPlaceholderText("Enter a message..")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Send" })).toBeTruthy();
  });

  it("should emit socket SEND_MESSAGE_LOBBY event on submit with a valid message", async () => {
    const user = userEvent.setup();
    renderComponent();

    const input = screen.getByPlaceholderText("Enter a message..");
    await user.clear(input);
    await user.type(input, "Hello lobby");
    await user.click(screen.getByRole("button", { name: "Send" }));

    expect(mockSocket.emit).toHaveBeenCalledWith("send message lobby", "Hello lobby");
  });

  it("should reset the form after a successful submit", async () => {
    const user = userEvent.setup();
    renderComponent();

    const input = screen.getByPlaceholderText<HTMLInputElement>("Enter a message..");
    await user.clear(input);
    await user.type(input, "Test message");
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
