<script setup lang="ts">
import { onMounted } from "vue";

import BoardCanvas from "@src/components/Board/BoardCanvas/BoardCanvas.vue";
import BoardSelectingWord from "@src/components/Board/BoardSelectingWord/BoardSelectingWord.vue";
import BoardSelectWord from "@src/components/Board/BoardSelectWord/BoardSelectWord.vue";

import { useUserStore } from "@src/stores/useUserStore";
import { useRoomStore } from "@src/stores/useRoomStore";


const userStore = useUserStore();
const roomStore = useRoomStore();

onMounted(() => {
  console.log(roomStore.$state);
});
</script>

<template>
  <article class="flex items-center justify-center rounded-lg shadow-md row-span-5 col-span-3 h-full w-full bg-primary">
    <board-canvas v-if="roomStore.wordToGuess.actualWord"></board-canvas>
    <board-selecting-word v-if="
      !roomStore.wordToGuess.actualWord &&
      roomStore.playerChoosingWord &&
      roomStore.playerChoosingWord.id !== userStore.id
    "></board-selecting-word>

    <board-select-word v-if="
      roomStore.playerChoosingWord &&
      !roomStore.wordToGuess.actualWord &&
      roomStore.playerChoosingWord.id === userStore.id
    "></board-select-word>
  </article>
</template>
