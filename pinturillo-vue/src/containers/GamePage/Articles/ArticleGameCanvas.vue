<script setup lang="ts">
import { onMounted } from "vue";

import BoardCanvas from "@/components/Board/BoardCanvas/BoardCanvas.vue";
import BoardSelectingWord from "@/components/Board/BoardSelectingWord/BoardSelectingWord.vue";
import BoardSelectWord from "@/components/Board/BoardSelectWord/BoardSelectWord.vue";

import { useRoomStore } from "@/stores/room/room";
import { useUserStore } from "@/stores/user/user";

const userStore = useUserStore();
const roomStore = useRoomStore();

onMounted(() => {
  console.log(roomStore.$state);
});
</script>

<template>
  <article
    class="flex items-center justify-center rounded-lg shadow-md row-span-5 col-span-3 h-full w-full bg-primary"
  >
    <BoardCanvas v-if="roomStore.wordToGuess.actualWord"></BoardCanvas>
    <BoardSelectingWord
      v-if="
        !roomStore.wordToGuess.actualWord &&
        roomStore.playerChoosingWord &&
        roomStore.playerChoosingWord.id !== userStore.id
      "
    ></BoardSelectingWord>

    <BoardSelectWord
      v-if="
        roomStore.playerChoosingWord &&
        !roomStore.wordToGuess.actualWord &&
        roomStore.playerChoosingWord.id === userStore.id
      "
    ></BoardSelectWord>
  </article>
</template>
