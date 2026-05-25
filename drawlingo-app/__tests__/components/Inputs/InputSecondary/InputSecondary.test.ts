import { render, screen, fireEvent } from "@testing-library/vue";

import type { RenderResult } from "@testing-library/vue";

import InputSecondary from "@/components/Inputs/InputSecondary/InputSecondary.vue";

const renderComponent = (props: {
  id: string;
  placeholder: string;
  modelValue: string;
  type: string;
  class?: string;
}): RenderResult => {
  return render(InputSecondary, { props });
};

describe("InputSecondary", () => {
  it("should render with placeholder", () => {
    renderComponent({
      id: "email",
      placeholder: "Enter email",
      modelValue: "",
      type: "text",
    });

    expect(screen.getByPlaceholderText("Enter email")).toBeTruthy();
  });

  it("should render with correct id and name attributes", () => {
    renderComponent({
      id: "username",
      placeholder: "Enter username",
      modelValue: "",
      type: "text",
    });

    const input = screen.getByPlaceholderText("Enter username");

    expect(input).toHaveAttribute("id", "username");
    expect(input).toHaveAttribute("name", "username");
  });

  it("should render with correct type attribute", () => {
    renderComponent({
      id: "password",
      placeholder: "Enter password",
      modelValue: "",
      type: "password",
    });

    const input = screen.getByPlaceholderText("Enter password");

    expect(input).toHaveAttribute("type", "password");
  });

  it("should apply custom class", () => {
    renderComponent({
      id: "test",
      placeholder: "Test",
      modelValue: "",
      type: "text",
      class: "extra-class",
    });

    const input = screen.getByPlaceholderText("Test");

    expect(input).toHaveClass("extra-class");
  });

  it("should emit update:modelValue when user types", async () => {
    const { emitted } = renderComponent({
      id: "test",
      placeholder: "Type here",
      modelValue: "",
      type: "text",
    });

    const input = screen.getByPlaceholderText("Type here");
    await fireEvent.update(input, "hello");

    expect(emitted()["update:modelValue"]).toBeTruthy();
    expect(emitted()["update:modelValue"]![0]).toEqual(["hello"]);
  });
});
