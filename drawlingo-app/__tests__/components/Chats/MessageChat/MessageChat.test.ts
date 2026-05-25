import { render, screen } from "@testing-library/vue";

import type { RenderResult } from "@testing-library/vue";

import MessageChat from "@/components/Chats/MessageChat/MessageChat.vue";

const renderComponent = (props: {
  username: string;
  message: string;
  classUsername?: string;
}): RenderResult => {
  return render(MessageChat, { props });
};

describe("MessageChat", () => {
  it("should render username with colon", () => {
    renderComponent({ username: "Alice", message: "Hello" });

    expect(screen.getByText("Alice:")).toBeTruthy();
  });

  it("should render message text", () => {
    renderComponent({ username: "Alice", message: "Hello world" });

    expect(screen.getByText(/Hello world/)).toBeTruthy();
  });

  it("should apply classUsername to the username span", () => {
    renderComponent({
      username: "Bob",
      message: "Hi",
      classUsername: "text-red-500",
    });

    const span = screen.getByText("Bob:");

    expect(span.tagName).toBe("SPAN");
    expect(span).toHaveClass("text-red-500");
  });
});
