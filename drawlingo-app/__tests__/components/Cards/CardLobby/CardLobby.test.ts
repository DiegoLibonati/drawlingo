import { render, screen } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import { createMemoryHistory, createRouter } from "vue-router";

import type { RenderResult } from "@testing-library/vue";
import type { Router } from "vue-router";
import type { User } from "@/types/app";
import type { CardLobbyProps } from "@/types/props";

import CardLobby from "@/components/Cards/CardLobby/CardLobby.vue";

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
      { path: "/lobby", component: { template: "<div>Lobby</div>" } },
      { path: "/room/lobby/:id", component: { template: "<div>Room</div>" } },
      { path: "/room/login/private", component: { template: "<div>Login</div>" } },
    ],
  });

const createMockOwner = (overrides: Partial<User> = {}): User => ({
  id: "owner-1",
  username: "RoomOwner",
  actualRoom: "room-1",
  ...overrides,
});

const renderComponent = async (
  propsOverrides: Partial<CardLobbyProps> = {}
): Promise<{ result: RenderResult; router: Router }> => {
  const router = createTestRouter();
  await router.push("/lobby");
  await router.isReady();

  const props: CardLobbyProps = {
    idRoom: "room-1",
    totalSlots: 6,
    usersInRoom: 2,
    ownerRoom: createMockOwner(),
    nameRoom: "Test Room",
    typeRoom: "Public Room",
    ...propsOverrides,
  };

  const result = render(CardLobby, {
    props,
    global: {
      plugins: [router],
    },
  });

  return { result, router };
};

describe("CardLobby", () => {
  beforeEach(() => {
    mockSocket.__reset();
  });

  it("should render the owner username", async () => {
    await renderComponent({ ownerRoom: createMockOwner({ username: "Alice" }) });

    expect(screen.getByText("Owner: Alice")).toBeTruthy();
  });

  it("should render the room name", async () => {
    await renderComponent({ nameRoom: "My Room" });

    expect(screen.getByText("Name: My Room")).toBeTruthy();
  });

  it("should render the room type", async () => {
    await renderComponent({ typeRoom: "Public Room" });

    expect(screen.getByText("Type: Public Room")).toBeTruthy();
  });

  it("should render the slots count", async () => {
    await renderComponent({ usersInRoom: 3, totalSlots: 8 });

    expect(screen.getByText("Slots: (3/8)")).toBeTruthy();
  });

  it("should render slot indicators for occupied and available slots", async () => {
    const { result } = await renderComponent({ usersInRoom: 2, totalSlots: 4 });

    const outSlots = result.container.querySelectorAll<HTMLDivElement>(".outSlot");
    const availableSlots = result.container.querySelectorAll<HTMLDivElement>(".availableSlot");

    expect(outSlots.length).toBe(2);
    expect(availableSlots.length).toBe(2);
  });

  it("should navigate to room lobby when clicking a public room", async () => {
    const user = userEvent.setup();
    const { result, router } = await renderComponent({
      idRoom: "room-42",
      typeRoom: "Public Room",
    });

    const card = result.container.firstElementChild as HTMLElement;
    await user.click(card);

    expect(router.currentRoute.value.path).toBe("/room/lobby/room-42");
  });

  it("should emit LEAVE_LOBBY and navigate to login page when clicking a private room", async () => {
    const user = userEvent.setup();
    const { result, router } = await renderComponent({
      idRoom: "room-private-1",
      typeRoom: "Private Room",
    });

    const card = result.container.firstElementChild as HTMLElement;
    await user.click(card);

    expect(mockSocket.emit).toHaveBeenCalledWith("leave lobby");
    expect(router.currentRoute.value.path).toBe("/room/login/private");
    expect(router.currentRoute.value.query.idRoom).toBe("room-private-1");
  });

  it("should not emit LEAVE_LOBBY when clicking a public room", async () => {
    const user = userEvent.setup();
    const { result } = await renderComponent({
      idRoom: "room-1",
      typeRoom: "Public Room",
    });

    const card = result.container.firstElementChild as HTMLElement;
    await user.click(card);

    expect(mockSocket.emit).not.toHaveBeenCalled();
  });
});
