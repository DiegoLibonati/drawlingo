<script setup lang="ts">
import { useRoomStore } from "@src/stores/useRoomStore";

const roomStore = useRoomStore();
</script>

<template>
  <div class="h-auto bg-secondary rounded-lg p-2">
    <h2 class="text-white text-2xl font-semibold">
      {{ roomStore.playerChoosingWord?.username }} is choosing a word to paint
    </h2>
  </div>
</template>
