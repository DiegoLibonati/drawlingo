import { render, screen } from "@testing-library/vue";
import { createTestingPinia } from "@pinia/testing";
import { createMemoryHistory, createRouter } from "vue-router";

import type { RenderResult } from "@testing-library/vue";
import type { Router } from "vue-router";

import SectionLoginPrivateRoom from "@/components/Sections/SectionLoginPrivateRoom/SectionLoginPrivateRoom.vue";

import { mockSocket } from "@tests/__mocks__/socket.mock";

vi.mock("@/socket", async () => {
  const { mockSocket } = await import("@tests/__mocks__/socket.mock");
  return { default: mockSocket };
});

const createTestRouter = (): Router =>
  createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: "/", component: { template: "<div>Home</div>" } },
      { path: "/room/login/private", component: { template: "<div>Login</div>" } },
    ],
  });

const renderComponent = async (): Promise<RenderResult> => {
  const router = createTestRouter();
  await router.push("/room/login/private");
  await router.isReady();

  return render(SectionLoginPrivateRoom, {
    global: {
      plugins: [
        createTestingPinia({
          createSpy: vi.fn,
          initialState: {
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

describe("SectionLoginPrivateRoom", () => {
  beforeEach(() => {
    mockSocket.__reset();
  });

  it("should render the heading text", async () => {
    await renderComponent();

    expect(screen.getByText("Connect to a private room")).toBeTruthy();
  });

  it("should render the section element", async () => {
    const { container } = await renderComponent();

    const section = container.querySelector<HTMLElement>("section");
    expect(section).toBeTruthy();
  });

  it("should render the FormLoginPrivate with submit button", async () => {
    await renderComponent();

    expect(screen.getByText("Connect")).toBeTruthy();
  });

  it("should render the form element inside the section", async () => {
    const { container } = await renderComponent();

    const form = container.querySelector<HTMLFormElement>("form");
    expect(form).toBeTruthy();
  });
});
