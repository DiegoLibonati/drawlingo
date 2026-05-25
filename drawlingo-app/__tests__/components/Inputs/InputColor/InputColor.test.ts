import { render, fireEvent } from "@testing-library/vue";

import type { RenderResult } from "@testing-library/vue";

import InputColor from "@/components/Inputs/InputColor/InputColor.vue";

const renderComponent = (props: { modelValue: string; class?: string }): RenderResult => {
  return render(InputColor, { props });
};

describe("InputColor", () => {
  it("should render with correct value", () => {
    const { container } = renderComponent({ modelValue: "#ff0000" });

    const input = container.querySelector<HTMLInputElement>("input[type='color']")!;

    expect(input).toBeTruthy();
    expect(input.value).toBe("#ff0000");
  });

  it("should apply custom class", () => {
    const { container } = renderComponent({
      modelValue: "#000000",
      class: "extra-class",
    });

    const input = container.querySelector<HTMLInputElement>("input[type='color']")!;

    expect(input).toHaveClass("extra-class");
  });

  it("should emit update:modelValue on input", async () => {
    const { container, emitted } = renderComponent({ modelValue: "#000000" });

    const input = container.querySelector<HTMLInputElement>("input[type='color']")!;
    await fireEvent.update(input, "#ff5533");

    expect(emitted()["update:modelValue"]).toBeTruthy();
    expect(emitted()["update:modelValue"]![0]).toEqual(["#ff5533"]);
  });
});
