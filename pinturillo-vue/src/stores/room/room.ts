import { defineStore, acceptHMRUpdate } from "pinia";

import { Player, Room } from "@/entities/entities";

import { useUserStore } from "@/stores/user/user";

export const useRoomStore = defineStore("room", {
  state: (): Room => ({
    id: "",
    configuration: {
      name: "",
      password: "",
      rounds: { actualRound: 1, totalRounds: 1 },
      slots: 6,
      type: "public",
      countdown: {
        countdownSelected: 90,
        countdownGame: 90,
      },
    },
    owner: {
      id: "",
      username: "",
      actualRoom: "",
    },
    players: [],
    started: false,
    wordToGuess: {
      actualWord: "",
      wordsToChoose: [],
      wordWithPlaceholder: "",
    },
  }),
  getters: {
    playersLength: (state: Room): number => {
      return state.players.length;
    },
    orderPlayersByScore: (state: Room): Player[] => {
      return state.players.sort((a, b) => b.score - a.score);
    },
    playerChoosingWord: (state: Room): Player | null => {
      return state.players.find((player) => player.choosingAWord)! || null;
    },
    playerPaitingWord: (state: Room): Player | null => {
      return state.players.find((player) => player.isPaiting)! || null;
    },
    currentPlayerGuessed: (state: Room): Player | null => {
      const userStore = useUserStore();

      return (
        state.players.find(
          (player) => player.id === userStore.id && player.guessed
        ) || null
      );
    },
    countdownGame: (state: Room): number => {
      return state.configuration.countdown.countdownGame;
    },
    countdownSelected: (state: Room): number => {
      return state.configuration.countdown.countdownSelected;
    },
  },
  actions: {
    setRoom(room: Room) {
      this.$state = room;
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useRoomStore, import.meta.hot));
}
