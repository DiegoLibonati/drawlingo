<script setup lang="ts">
import CardPlayerScore from "@src/components/Cards/CardPlayerScore/CardPlayerScore.vue";

import { useRoomStore } from "@src/stores/useRoomStore";

const roomStore = useRoomStore();
</script>

<template>
  <article class="flex-1 p-2 w-full rounded-lg bg-secondary mt-2 overflow-auto">
    <card-player-score
      v-for="(player, index) in roomStore.orderPlayersByScore"
      :player="player"
      :position="index + 1"
      :key="player.id"
    ></card-player-score>
  </article>
</template>
