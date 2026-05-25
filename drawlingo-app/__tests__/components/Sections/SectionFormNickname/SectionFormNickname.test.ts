import { render, screen } from "@testing-library/vue";
import { createTestingPinia } from "@pinia/testing";
import { createMemoryHistory, createRouter } from "vue-router";
import { vi } from "vitest";

import type { RenderResult } from "@testing-library/vue";
import type { Router } from "vue-router";

import SectionFormNickname from "@/components/Sections/SectionFormNickname/SectionFormNickname.vue";

import { mockSocket } from "@tests/__mocks__/socket.mock";

vi.mock("@/socket", async () => {
  const { mockSocket } = await import("@tests/__mocks__/socket.mock");
  return { default: mockSocket };
});

const createTestRouter = (): Router =>
  createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: "/", component: { template: "<div />" } },
      { path: "/lobby", component: { template: "<div />" } },
      { path: "/room/create", component: { template: "<div />" } },
      { path: "/room/login/private", component: { template: "<div />" } },
    ],
  });

const renderComponent = (): RenderResult => {
  const router = createTestRouter();

  return render(SectionFormNickname, {
    global: {
      plugins: [
        createTestingPinia({
          createSpy: vi.fn,
          initialState: {
            user: { id: "", username: "", actualRoom: "" },
            alert: { type: "", message: "" },
          },
        }),
        router,
      ],
    },
  });
};

describe("SectionFormNickname", () => {
  beforeEach(() => {
    mockSocket.__reset();
  });

  it("should render the section element", () => {
    const { container } = renderComponent();

    const section = container.querySelector<HTMLElement>("section");
    expect(section).toBeTruthy();
  });

  it("should render the LOBBY button from FormNickname", () => {
    renderComponent();

    expect(screen.getByText("LOBBY")).toBeTruthy();
  });

  it("should render the CREATE ROOM button from FormNickname", () => {
    renderComponent();

    expect(screen.getByText("CREATE ROOM")).toBeTruthy();
  });

  it("should render the JOIN TO PRIVATE ROOM button from FormNickname", () => {
    renderComponent();

    expect(screen.getByText("JOIN TO PRIVATE ROOM")).toBeTruthy();
  });
});
