import { render, screen } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import { createTestingPinia } from "@pinia/testing";
import { createMemoryHistory, createRouter } from "vue-router";

import type { RenderResult } from "@testing-library/vue";
import type { Router } from "vue-router";
import type { Rooms } from "@/types/app";

import SectionLobbyRooms from "@/components/Sections/SectionLobbyRooms/SectionLobbyRooms.vue";

import { mockSocket } from "@tests/__mocks__/socket.mock";

vi.mock("@/socket", async () => {
  const { mockSocket } = await import("@tests/__mocks__/socket.mock");
  return { default: mockSocket };
});

const createTestRouter = (): Router =>
  createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: "/", component: { template: "<div />" } },
      { path: "/lobby", component: { template: "<div>Lobby</div>" } },
      {
        path: "/room/lobby/:id",
        component: { template: "<div>Room</div>" },
      },
      {
        path: "/room/create",
        component: { template: "<div>Create</div>" },
      },
      {
        path: "/room/login/private",
        component: { template: "<div>Login</div>" },
      },
      { path: "/game", component: { template: "<div>Game</div>" } },
      { path: "/score", component: { template: "<div>Score</div>" } },
    ],
  });

const createMockRooms = (): Rooms => ({
  "room-1": {
    id: "room-1",
    configuration: {
      name: "Room Alpha",
      password: "",
      rounds: { actualRound: 1, totalRounds: 1 },
      slots: 6,
      type: "public",
      countdown: { countdownSelected: 90, countdownGame: 90 },
    },
    owner: { id: "u1", username: "Alice", actualRoom: "room-1" },
    players: [
      {
        id: "u1",
        username: "Alice",
        actualRoom: "room-1",
        isPainting: false,
        alreadyPainted: false,
        choosingAWord: false,
        score: 0,
        guessed: false,
      },
    ],
    started: false,
    wordToGuess: {
      actualWord: "",
      wordsToChoose: [],
      wordWithPlaceholder: "",
    },
  },
  "room-2": {
    id: "room-2",
    configuration: {
      name: "Room Beta",
      password: "secret",
      rounds: { actualRound: 1, totalRounds: 2 },
      slots: 8,
      type: "private",
      countdown: { countdownSelected: 60, countdownGame: 60 },
    },
    owner: { id: "u2", username: "Bob", actualRoom: "room-2" },
    players: [
      {
        id: "u2",
        username: "Bob",
        actualRoom: "room-2",
        isPainting: false,
        alreadyPainted: false,
        choosingAWord: false,
        score: 0,
        guessed: false,
      },
      {
        id: "u3",
        username: "Charlie",
        actualRoom: "room-2",
        isPainting: false,
        alreadyPainted: false,
        choosingAWord: false,
        score: 0,
        guessed: false,
      },
    ],
    started: false,
    wordToGuess: {
      actualWord: "",
      wordsToChoose: [],
      wordWithPlaceholder: "",
    },
  },
});

const renderComponent = async (
  lobbyState: Record<string, unknown> = {},
  initialRoute = "/lobby"
): Promise<RenderResult> => {
  const router = createTestRouter();
  await router.push(initialRoute);
  await router.isReady();

  return render(SectionLobbyRooms, {
    global: {
      plugins: [
        router,
        createTestingPinia({
          createSpy: vi.fn,
          initialState: {
            lobby: {
              id: "lobby_room",
              rooms: {},
              users: [
                { id: "u1", username: "Alice", actualRoom: "" },
                { id: "u2", username: "Bob", actualRoom: "" },
              ],
              appTotalPlayers: 5,
              ...lobbyState,
            },
          },
        }),
      ],
    },
  });
};

describe("SectionLobbyRooms", () => {
  beforeEach(() => {
    mockSocket.__reset();
  });

  it("should render rooms count as 0 when no rooms exist", async () => {
    await renderComponent();

    expect(screen.getByText("Rooms: 0")).toBeTruthy();
  });

  it("should render lobby users count", async () => {
    await renderComponent();

    expect(screen.getByText("Lobby Users: 2")).toBeTruthy();
  });

  it("should render total players count", async () => {
    await renderComponent();

    expect(screen.getByText("All Players: 5")).toBeTruthy();
  });

  it("should show create room button when no rooms exist", async () => {
    await renderComponent();

    expect(screen.getByRole("button", { name: /Create a room/i })).toBeTruthy();
  });

  it("should not show create room button when rooms exist", async () => {
    await renderComponent({ rooms: createMockRooms() });

    expect(screen.queryByRole("button", { name: /Create a room/i })).toBeNull();
  });

  it("should render rooms count matching the number of rooms", async () => {
    await renderComponent({ rooms: createMockRooms() });

    expect(screen.getByText("Rooms: 2")).toBeTruthy();
  });

  it("should render CardLobby for each room in the store", async () => {
    await renderComponent({ rooms: createMockRooms() });

    expect(screen.getByText("Name: Room Alpha")).toBeTruthy();
    expect(screen.getByText("Name: Room Beta")).toBeTruthy();
    expect(screen.getByText("Type: Public Room")).toBeTruthy();
    expect(screen.getByText("Type: Private Room")).toBeTruthy();
  });

  it("should emit LEAVE_LOBBY socket event when create room button is clicked", async () => {
    const user = userEvent.setup();
    const router = createTestRouter();
    await router.push("/lobby");
    await router.isReady();
    const pushSpy = vi.spyOn(router, "push");

    render(SectionLobbyRooms, {
      global: {
        plugins: [
          router,
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              lobby: {
                id: "lobby_room",
                rooms: {},
                users: [],
                appTotalPlayers: 0,
              },
            },
          }),
        ],
      },
    });

    await user.click(screen.getByRole("button", { name: /Create a room/i }));

    expect(mockSocket.emit).toHaveBeenCalledWith("leave lobby");
    expect(pushSpy).toHaveBeenCalledWith("/room/create");
  });
});
