import { render, screen } from "@testing-library/vue";
import { createTestingPinia } from "@pinia/testing";
import { createMemoryHistory, createRouter } from "vue-router";
import { vi } from "vitest";

import type { RenderResult } from "@testing-library/vue";
import type { Router } from "vue-router";

import SectionFormCreateRoom from "@/components/Sections/SectionFormCreateRoom/SectionFormCreateRoom.vue";

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
      { path: "/room/lobby/:id", component: { template: "<div />" } },
      { path: "/room/create", component: { template: "<div />" } },
    ],
  });

const renderComponent = (): RenderResult => {
  const router = createTestRouter();

  return render(SectionFormCreateRoom, {
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
            alert: {
              type: "",
              message: "",
            },
          },
        }),
        router,
      ],
    },
  });
};

describe("SectionFormCreateRoom", () => {
  beforeEach(() => {
    mockSocket.__reset();
  });

  it("should render the section element", () => {
    const { container } = renderComponent();

    const section = container.querySelector<HTMLElement>("section");
    expect(section).toBeTruthy();
  });

  it("should render the FormCreateRoom with the submit button", () => {
    renderComponent();

    expect(screen.getByText(/Create room!/)).toBeTruthy();
  });

  it("should render the form element inside the section", () => {
    const { container } = renderComponent();

    const form = container.querySelector<HTMLFormElement>("form");
    expect(form).toBeTruthy();
  });
});
