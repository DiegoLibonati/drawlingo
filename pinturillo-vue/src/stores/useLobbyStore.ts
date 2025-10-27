import { defineStore, acceptHMRUpdate } from "pinia";

import { Lobby } from "@src/entities/app";

export const useLobbyStore = defineStore("lobby", {
  state: (): Lobby => ({
    id: "lobby_room",
    rooms: {},
    users: [],
    appTotalPlayers: 0,
  }),
  getters: {
    roomsLength: (state) => {
      if (!state.rooms) {
        return 0;
      }

      return Object.keys(state.rooms).length;
    },
    usersOnInLobby: (state) => {
      if (!state.users) {
        return 0;
      }

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
