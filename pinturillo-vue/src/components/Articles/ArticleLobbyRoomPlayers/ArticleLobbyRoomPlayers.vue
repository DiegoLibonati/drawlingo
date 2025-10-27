<script setup lang="ts">
import CardPlayerRoomLobby from "@src/components/Cards/CardPlayerRoomLobby/CardPlayerRoomLobby.vue";

import { useRoomStore } from "@src/stores/useRoomStore";

const roomStore = useRoomStore();
</script>

<template>
  <article class="flex flex-1 flex-col items-center justify-start w-full bg-secondary rounded-lg p-2 overflow-auto">
    <card-player-room-lobby v-for="(player, index) in roomStore.players" :key="player.id" :username="player.username"
      :isOwner="player.id === roomStore.owner.id" :class="index !== 0 ? 'mt-2' : ''"></card-player-room-lobby>
  </article>
</template>
