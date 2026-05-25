import { defineStore, acceptHMRUpdate } from "pinia";

import type { Lobby } from "@/types/app";

export const useLobbyStore = defineStore("lobby", {
  state: (): Lobby => ({
    id: "lobby_room",
    rooms: {},
    users: [],
    appTotalPlayers: 0,
  }),
  getters: {
    roomsLength: (state) => {
      return Object.keys(state.rooms).length;
    },
    usersOnInLobby: (state) => {
      return state.users.length;
    },
  },
  actions: {
    setLobby(lobby: Lobby): void {
      this.$state = lobby;
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useLobbyStore, import.meta.hot));
}
