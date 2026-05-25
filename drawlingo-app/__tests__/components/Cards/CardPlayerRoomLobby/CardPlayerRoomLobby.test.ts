import { render, screen } from "@testing-library/vue";

import type { RenderResult } from "@testing-library/vue";

import CardPlayerRoomLobby from "@/components/Cards/CardPlayerRoomLobby/CardPlayerRoomLobby.vue";

const renderComponent = (props: {
  username: string;
  isOwner: boolean;
  class?: string;
}): RenderResult => {
  return render(CardPlayerRoomLobby, {
    props,
    global: {
      stubs: { "v-icon": true },
    },
  });
};

describe("CardPlayerRoomLobby", () => {
  it("should render the username", () => {
    renderComponent({ username: "PlayerOne", isOwner: false });

    expect(screen.getByText("PlayerOne")).toBeTruthy();
  });

  it("should render v-icon when isOwner is true", () => {
    const { container } = renderComponent({ username: "Owner", isOwner: true });

    const iconStub = container.querySelector<HTMLElement>("v-icon-stub");

    expect(iconStub).toBeTruthy();
  });

  it("should not render v-icon when isOwner is false", () => {
    const { container } = renderComponent({
      username: "Regular",
      isOwner: false,
    });

    const iconStub = container.querySelector<HTMLElement>("v-icon-stub");

    expect(iconStub).toBeNull();
  });

  it("should apply custom class", () => {
    const { container } = renderComponent({
      username: "Player",
      isOwner: false,
      class: "extra-class",
    });

    const card = container.firstElementChild as HTMLElement;

    expect(card).toHaveClass("extra-class");
  });
});
