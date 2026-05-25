import { defineStore, acceptHMRUpdate } from "pinia";

import type { User } from "@/types/app";

import { useSessionStorage } from "@/composables/useSessionStorage";

export const useUserStore = defineStore("user", {
  state: (): User => ({
    id: "",
    username: "",
    actualRoom: "",
  }),
  getters: {
    user: (state) => {
      return {
        id: state.id,
        username: state.username,
        actualRoom: state.actualRoom,
      };
    },
  },
  actions: {
    login(user: User): void {
      this.$state = user;
    },
    updateUserRoom(actualRoom: string): void {
      const { handleSetItem } = useSessionStorage();

      this.actualRoom = actualRoom;

      if (this.id && this.username && this.actualRoom) {
        handleSetItem("user", this.$state);
      }
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
}

// TODO: ACTUALIZAR ID DESDE AL STORE
