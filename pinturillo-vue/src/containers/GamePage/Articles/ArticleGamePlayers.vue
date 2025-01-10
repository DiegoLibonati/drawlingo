<script setup lang="ts">
import CardPlayerGame from "@/components/Cards/CardPlayerGame/CardPlayerGame.vue";

import { useRoomStore } from "@/stores/room/room";

const roomStore = useRoomStore();
</script>

<template>
  <article
    class="flex gap-2 flex-col items-center justify-start rounded-lg shadow-md row-span-5 h-full w-full p-2 bg-primary overflow-auto"
  >
    <CardPlayerGame
      v-for="(player, index) in roomStore.orderPlayersByScore"
      :key="player.id"
      :player="player"
      :position="index + 1"
    ></CardPlayerGame>
  </article>
</template>
