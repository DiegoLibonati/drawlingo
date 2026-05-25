import { render, screen, fireEvent } from "@testing-library/vue";

import type { RenderResult } from "@testing-library/vue";

import InputTransparent from "@/components/Inputs/InputTransparent/InputTransparent.vue";

const renderComponent = (props: {
  id: string;
  placeholder: string;
  modelValue: string;
  labelValue?: string;
  class?: string;
}): RenderResult => {
  return render(InputTransparent, { props });
};

describe("InputTransparent", () => {
  it("should render label when labelValue is provided", () => {
    renderComponent({
      id: "name",
      placeholder: "Enter name",
      modelValue: "",
      labelValue: "Name",
    });

    expect(screen.getByText("Name")).toBeTruthy();
    expect(screen.getByText("Name").tagName).toBe("LABEL");
  });

  it("should not render label when labelValue is not provided", () => {
    renderComponent({
      id: "name",
      placeholder: "Enter name",
      modelValue: "",
    });

    expect(screen.queryByRole("label")).toBeNull();
  });

  it("should render input with placeholder", () => {
    renderComponent({
      id: "field",
      placeholder: "Enter value",
      modelValue: "",
    });

    expect(screen.getByPlaceholderText("Enter value")).toBeTruthy();
  });

  it("should render with correct id and name attributes", () => {
    renderComponent({
      id: "myfield",
      placeholder: "Placeholder",
      modelValue: "",
    });

    const input = screen.getByPlaceholderText("Placeholder");

    expect(input).toHaveAttribute("id", "myfield");
    expect(input).toHaveAttribute("name", "myfield");
  });

  it("should apply custom class to input", () => {
    renderComponent({
      id: "test",
      placeholder: "Test",
      modelValue: "",
      class: "extra-class",
    });

    const input = screen.getByPlaceholderText("Test");

    expect(input).toHaveClass("extra-class");
  });

  it("should emit update:modelValue on input", async () => {
    const { emitted } = renderComponent({
      id: "test",
      placeholder: "Type here",
      modelValue: "",
    });

    const input = screen.getByPlaceholderText("Type here");
    await fireEvent.update(input, "new value");

    expect(emitted()["update:modelValue"]).toBeTruthy();
    expect(emitted()["update:modelValue"]![0]).toEqual(["new value"]);
  });
});
