import { render, screen } from "@testing-library/vue";
import { createRouter, createMemoryHistory } from "vue-router";
import { createTestingPinia } from "@pinia/testing";
import { defineComponent, h } from "vue";

import type { RenderResult } from "@testing-library/vue";
import type { Router } from "vue-router";

import MainLayout from "@/layouts/MainLayout/MainLayout.vue";

const DummyPage = defineComponent({
  render() {
    return h("div", "dummy");
  },
});

vi.mock("@/socket", async () => {
  const { mockSocket } = await import("@tests/__mocks__/socket.mock");
  return { default: mockSocket };
});

const createTestRouter = (_initialRoute = "/lobby"): Router => {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: "/", component: DummyPage },
      { path: "/lobby", component: DummyPage },
      { path: "/game/:id", component: DummyPage },
    ],
  });
};

const renderLayout = async (
  props: { class: string; layoutType: "flex" | "grid" },
  initialRoute = "/lobby",
  slotContent = "Slot Content"
): Promise<RenderResult> => {
  const router = createTestRouter(initialRoute);
  await router.push(initialRoute);
  await router.isReady();

  return render(MainLayout, {
    props,
    slots: { default: slotContent },
    global: {
      plugins: [
        router,
        createTestingPinia({
          createSpy: vi.fn,
          initialState: {
            user: { id: "", username: "", actualRoom: "" },
          },
        }),
      ],
      stubs: { Mobile: true },
    },
  });
};

describe("MainLayout", () => {
  it("should render slot content inside main", async () => {
    await renderLayout({ class: "custom", layoutType: "flex" });

    expect(screen.getByText("Slot Content")).toBeTruthy();
  });

  it("should apply flex layout type class", async () => {
    const { container } = await renderLayout({
      class: "extra",
      layoutType: "flex",
    });

    const main = container.querySelector<HTMLElement>("main");
    expect(main).toHaveClass("lg:flex");
  });

  it("should apply grid layout type class", async () => {
    const { container } = await renderLayout({
      class: "extra",
      layoutType: "grid",
    });

    const main = container.querySelector<HTMLElement>("main");
    expect(main).toHaveClass("lg:grid");
  });

  it("should apply custom class from props", async () => {
    const { container } = await renderLayout({
      class: "my-custom-class",
      layoutType: "flex",
    });

    const main = container.querySelector<HTMLElement>("main");
    expect(main).toHaveClass("my-custom-class");
  });

  it("should apply h-screen class on game route", async () => {
    const { container } = await renderLayout({ class: "extra", layoutType: "flex" }, "/game/123");

    const main = container.querySelector<HTMLElement>("main");
    expect(main).toHaveClass("h-screen");
  });

  it("should apply calc height class on non-game route", async () => {
    const { container } = await renderLayout({ class: "extra", layoutType: "flex" }, "/lobby");

    const main = container.querySelector<HTMLElement>("main");
    expect(main).toHaveClass("h-[calc(100vh_-_5rem)]");
  });

  it("should always apply base classes", async () => {
    const { container } = await renderLayout({
      class: "",
      layoutType: "flex",
    });

    const main = container.querySelector<HTMLElement>("main");
    expect(main).toHaveClass("flex");
    expect(main).toHaveClass("w-full");
    expect(main).toHaveClass("bg-secondary");
  });
});
