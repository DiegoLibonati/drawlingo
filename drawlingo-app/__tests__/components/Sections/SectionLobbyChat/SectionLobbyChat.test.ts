import { render, screen } from "@testing-library/vue";
import { createTestingPinia } from "@pinia/testing";
import { vi } from "vitest";

import type { RenderResult } from "@testing-library/vue";

import SectionLobbyChat from "@/components/Sections/SectionLobbyChat/SectionLobbyChat.vue";

import { mockSocket } from "@tests/__mocks__/socket.mock";

vi.mock("@/socket", async () => {
  const { mockSocket } = await import("@tests/__mocks__/socket.mock");
  return { default: mockSocket };
});

const renderComponent = (): RenderResult => {
  return render(SectionLobbyChat, {
    global: {
      plugins: [
        createTestingPinia({
          createSpy: vi.fn,
          initialState: {
            user: {
              id: "user-1",
              username: "TestUser",
              actualRoom: "",
            },
          },
        }),
      ],
    },
  });
};

describe("SectionLobbyChat", () => {
  beforeEach(() => {
    mockSocket.__reset();
  });

  it("should render the section element", () => {
    const { container } = renderComponent();

    const section = container.querySelector<HTMLElement>("section");
    expect(section).toBeTruthy();
  });

  it("should render the Send button from ChatLobby", () => {
    renderComponent();

    expect(screen.getByText("Send")).toBeTruthy();
  });

  it("should render the message input from ChatLobby", () => {
    renderComponent();

    expect(screen.getByPlaceholderText("Enter a message..")).toBeTruthy();
  });
});
