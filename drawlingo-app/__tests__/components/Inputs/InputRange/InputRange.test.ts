import { render, fireEvent } from "@testing-library/vue";

import type { RenderResult } from "@testing-library/vue";

import InputRange from "@/components/Inputs/InputRange/InputRange.vue";

const renderComponent = (props: { modelValue: number; class?: string }): RenderResult => {
  return render(InputRange, { props });
};

describe("InputRange", () => {
  it("should render with correct value", () => {
    const { container } = renderComponent({ modelValue: 5 });

    const input = container.querySelector<HTMLInputElement>("input[type='range']")!;

    expect(input).toBeTruthy();
    expect(input.value).toBe("5");
  });

  it("should have correct min, max and step attributes", () => {
    const { container } = renderComponent({ modelValue: 1 });

    const input = container.querySelector<HTMLInputElement>("input[type='range']")!;

    expect(input).toHaveAttribute("min", "0.1");
    expect(input).toHaveAttribute("max", "10");
    expect(input).toHaveAttribute("step", "0.1");
  });

  it("should apply custom class", () => {
    const { container } = renderComponent({
      modelValue: 3,
      class: "extra-class",
    });

    const input = container.querySelector<HTMLInputElement>("input[type='range']")!;

    expect(input).toHaveClass("extra-class");
  });

  it("should emit update:modelValue on input", async () => {
    const { container, emitted } = renderComponent({ modelValue: 1 });

    const input = container.querySelector<HTMLInputElement>("input[type='range']")!;
    await fireEvent.update(input, "7");

    expect(emitted()["update:modelValue"]).toBeTruthy();
    expect(emitted()["update:modelValue"]![0]).toEqual(["7"]);
  });
});
