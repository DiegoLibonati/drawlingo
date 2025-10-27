<script setup lang="ts">
import CardPlayerGame from "@src/components/Cards/CardPlayerGame/CardPlayerGame.vue";

import { useRoomStore } from "@src/stores/useRoomStore";

const roomStore = useRoomStore();
</script>

<template>
  <article
    class="flex gap-2 flex-col items-center justify-start rounded-lg shadow-md row-span-5 h-full w-full p-2 bg-primary overflow-auto">
    <card-player-game v-for="(player, index) in roomStore.orderPlayersByScore" :key="player.id" :player="player"
      :position="index + 1"></card-player-game>
  </article>
</template>
