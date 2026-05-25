<script setup lang="ts">
import { useRoomStore } from "@/stores/useRoomStore";

const roomStore = useRoomStore();
</script>

<template>
  <article
    class="grid grid-cols-3 grid-rows-1 gap-2 w-full h-full p-2 bg-primary col-span-6 row-span-1 rounded-lg"
  >
    <div class="flex flex-col items-center justify-center bg-secondary p-2 rounded-lg w-full">
      <h2 class="text-2xl font-bold text-white">Room ID</h2>
      <h3 class="text-white text-xl">
        {{ roomStore.id }}
      </h3>
    </div>
    <div class="flex flex-col items-center justify-center bg-secondary p-2 rounded-lg w-full">
      <h2 class="text-2xl font-bold text-white">Rounds</h2>
      <h3 class="text-white text-xl">
        {{ roomStore.configuration.rounds.actualRound }}/{{
          roomStore.configuration.rounds.totalRounds
        }}
      </h3>
    </div>
    <div class="flex flex-col items-center justify-center bg-secondary p-2 rounded-lg w-full">
      <h2 class="text-2xl font-bold text-white">Room Owner</h2>
      <h3 class="text-white text-xl">
        {{ roomStore.owner.username }}
      </h3>
    </div>
  </article>
</template>
