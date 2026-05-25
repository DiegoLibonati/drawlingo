import { render, screen } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";

import type { RenderResult } from "@testing-library/vue";

import ButtonGridTertiaryFull from "@/components/Buttons/ButtonGridTertiaryFull/ButtonGridTertiaryFull.vue";

const renderComponent = (props: { click: () => void }): RenderResult => {
  return render(ButtonGridTertiaryFull, {
    props,
    slots: { default: "Full Grid Button" },
  });
};

describe("ButtonGridTertiaryFull", () => {
  it("should render with slot content", () => {
    renderComponent({ click: vi.fn() });

    expect(screen.getByRole("button")).toHaveTextContent("Full Grid Button");
  });

  it("should render with type button", () => {
    renderComponent({ click: vi.fn() });

    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
  });

  it("should call click handler when clicked", async () => {
    const user = userEvent.setup();
    const clickHandler = vi.fn();
    renderComponent({ click: clickHandler });

    await user.click(screen.getByRole("button"));

    expect(clickHandler).toHaveBeenCalledTimes(1);
  });
});
