<script setup lang="ts">
import { EVENTS_SOCKET_CLIENT } from "@src/entities/enums";

import ButtonPrimary from "@src/components/Buttons/ButtonPrimary/ButtonPrimary.vue";

import { useRoomStore } from "@src/stores/useRoomStore";

import socket from "@src/socket";

const roomStore = useRoomStore();

const handleWordChoosed = (word: string) => {
  socket.emit(EVENTS_SOCKET_CLIENT.WORD_SELECTED_GAME, {
    idRoom: roomStore.id,
    wordSelected: word,
  });
};
</script>

<template>
  <div class="h-auto bg-secondary rounded-lg p-2">
    <h2 class="text-white text-2xl font-semibold">Select a word to paint</h2>

    <div class="flex flex-col items-center justify-center">
      <button-primary
        v-for="word in roomStore.wordToGuess.wordsToChoose"
        :click="() => handleWordChoosed(word)"
        class="mt-2"
        type="button"
      >
        {{ word }}
      </button-primary>
    </div>
  </div>
</template>
