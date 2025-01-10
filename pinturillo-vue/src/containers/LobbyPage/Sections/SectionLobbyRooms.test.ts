import { shallowMount } from "@vue/test-utils";

import { createPinia, setActivePinia } from "pinia";
import { createRouter, createWebHistory, Router } from "vue-router";

import { Room } from "@/entities/entities";

import SectionLobbyRooms from "@/containers/LobbyPage/Sections/SectionLobbyRooms.vue";

import { useLobbyStore } from "@/stores/lobby/lobby";

jest.mock("@/stores/lobby/lobby", () => ({
  useLobbyStore: jest.fn(),
}));

describe("SectionLobbyRooms.vue", () => {
  let router: Router;
  let pinia: ReturnType<typeof createPinia>;

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);

    router = createRouter({
      history: createWebHistory(),
      routes: [
        {
          path: "/",
          component: { template: "<div>Home</div>" },
          name: "homepage",
        },
      ],
    });
  });

  describe("General Tests.", () => {
    const roomsLength = 5;
    const usersOnInLobby = 6;
    const appTotalPlayers = 7;

    beforeEach(() => {
      const lobbyStoreMock = {
        roomsLength: roomsLength,
        usersOnInLobby: usersOnInLobby,
        appTotalPlayers: appTotalPlayers,
      } as unknown as jest.Mocked<ReturnType<typeof useLobbyStore>>;

      (useLobbyStore as unknown as jest.Mock).mockReturnValue(lobbyStoreMock);
    });

    test("It should render the general information table of the app, rooms, lobby users and all the players that are connected.", async () => {
      const wrapper = shallowMount(SectionLobbyRooms, {
        global: { plugins: [router] },
      });

      const headings = wrapper.findAll("h2.text-white.font-semibold");

      expect(headings.at(0)?.text()).toBe(`Rooms: ${roomsLength}`);
      expect(headings.at(1)?.text()).toBe(`Lobby Users: ${usersOnInLobby}`);
      expect(headings.at(2)?.text()).toBe(`All Players: ${appTotalPlayers}`);
    });
  });

  describe("If rooms length is equal to 0.", () => {
    const roomsLength = 0;

    beforeEach(() => {
      const lobbyStoreMock = {
        roomsLength: roomsLength,
      } as unknown as jest.Mocked<ReturnType<typeof useLobbyStore>>;

      (useLobbyStore as unknown as jest.Mock).mockReturnValue(lobbyStoreMock);
    });

    test("It must render the create room button.", async () => {
      const wrapper = shallowMount(SectionLobbyRooms, {
        global: { plugins: [router] },
      });

      const btnCreateRoom = wrapper.find("button-primary-stub");

      expect(btnCreateRoom.exists()).toBe(true);
    });
  });

  describe("If rooms has content.", () => {
    const rooms: Room[] = [
      {
        id: "2",
        configuration: {
          countdown: { countdownGame: 2, countdownSelected: 10 },
          name: "asd",
          password: "",
          rounds: { actualRound: 2, totalRounds: 3 },
          slots: 8,
          type: "public",
        },
        owner: { id: "pepe", actualRoom: "123", username: "pepe" },
        players: [
          {
            id: "pepe",
            actualRoom: "123",
            username: "pepe",
            alreadyPainted: false,
            choosingAWord: false,
            guessed: false,
            isPaiting: false,
            score: 10,
          },
        ],
        started: false,
        wordToGuess: {
          actualWord: "",
          wordsToChoose: [],
          wordWithPlaceholder: "",
        },
      },
    ];

    beforeEach(() => {
      const lobbyStoreMock = {
        rooms: rooms,
      } as unknown as jest.Mocked<ReturnType<typeof useLobbyStore>>;

      (useLobbyStore as unknown as jest.Mock).mockReturnValue(lobbyStoreMock);
    });

    test("It must render all cards rooms.", async () => {
      const wrapper = shallowMount(SectionLobbyRooms, {
        global: { plugins: [router] },
      });

      const listRooms = wrapper.find("article.grid.grid-cols-2.gap-2.mt-2");

      expect(listRooms.exists()).toBe(true);
      expect(listRooms.element.children).toHaveLength(rooms.length);
    });
  });
});
