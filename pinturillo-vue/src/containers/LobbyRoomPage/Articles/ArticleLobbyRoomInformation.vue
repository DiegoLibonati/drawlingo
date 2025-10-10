<script setup lang="ts">
import { useRoomStore } from "@src/stores/room/room";

const roomStore = useRoomStore();
</script>

<template>
  <article
    class="flex flex-2 flex-col items-center justify-center w-full bg-secondary rounded-lg p-2 mb-2"
  >
    <h2 class="text-white">
      <span class="font-bold">ROOM ID: </span>{{ roomStore.id }}
    </h2>
  </article>
</template>
