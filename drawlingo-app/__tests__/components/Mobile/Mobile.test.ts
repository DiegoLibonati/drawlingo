import { render, screen } from "@testing-library/vue";
import { createMemoryHistory, createRouter } from "vue-router";

import type { RenderResult } from "@testing-library/vue";
import type { Router } from "vue-router";

import Mobile from "@/components/Mobile/Mobile.vue";

import { mockSocket } from "@tests/__mocks__/socket.mock";

vi.mock("@/socket", async () => {
  const { mockSocket } = await import("@tests/__mocks__/socket.mock");
  return { default: mockSocket };
});

const createTestRouter = (): Router =>
  createRouter({
    history: createMemoryHistory(),
    routes: [{ path: "/", component: { template: "<div />" } }],
  });

const renderComponent = async (): Promise<RenderResult> => {
  const router = createTestRouter();
  await router.push("/");
  await router.isReady();

  return render(Mobile, {
    global: {
      plugins: [router],
    },
  });
};

describe("Mobile", () => {
  beforeEach(() => {
    mockSocket.__reset();
  });

  it("should render the mobile unavailability message", async () => {
    await renderComponent();

    expect(
      screen.getByText("This version of drawlingo is not available for touch devices.")
    ).toBeTruthy();
  });

  it("should render the Logo component", async () => {
    await renderComponent();

    expect(screen.getByText("Drawlingo")).toBeTruthy();
  });
});
