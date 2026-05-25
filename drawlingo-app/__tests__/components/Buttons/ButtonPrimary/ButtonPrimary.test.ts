import { render, screen } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";

import type { RenderResult } from "@testing-library/vue";
import type { ButtonPrimaryProps } from "@/types/props";

import ButtonPrimary from "@/components/Buttons/ButtonPrimary/ButtonPrimary.vue";

const renderComponent = (props: ButtonPrimaryProps): RenderResult => {
  return render(ButtonPrimary, {
    props,
    slots: { default: "Click me" },
  });
};

describe("ButtonPrimary", () => {
  it("should render with slot content", () => {
    renderComponent({ type: "button" });

    expect(screen.getByRole("button")).toHaveTextContent("Click me");
  });

  it("should render with correct type attribute", () => {
    renderComponent({ type: "submit" });

    expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
  });

  it("should call click handler when clicked", async () => {
    const user = userEvent.setup();
    const clickHandler = vi.fn();
    renderComponent({ type: "button", click: clickHandler });

    await user.click(screen.getByRole("button"));

    expect(clickHandler).toHaveBeenCalledTimes(1);
  });

  it("should apply custom class", () => {
    renderComponent({ type: "button", class: "extra-class" });

    expect(screen.getByRole("button")).toHaveClass("extra-class");
  });
});
