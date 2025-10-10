<script setup lang="ts">
import { Player } from "@src/entities/entities";

const props = defineProps<{
  position: number;
  player: Player;
}>();
</script>

<template>
  <div
    :class="[
      'flex flex-row justify-between items-center w-full p-2 rounded-lg shadow-md',
      props.position === 1
        ? 'bg-green-500'
        : props.position === 2
        ? 'bg-yellow-500 mt-2'
        : 'bg-red-500 mt-2',
    ]"
  >
    <div class="flex flex-row justify-start items-center w-auto">
      <h3
        class="flex items-center justify-center text-white text-2xl bg-primary rounded-lg h-12 w-12"
      >
        {{ position }}
      </h3>
      <h4 class="text-white font-bold tracking-wide text-xl ml-2">
        {{ props.player.username }}
      </h4>
    </div>
    <h5 class="text-white font-bold tracking-wide">
      {{ props.player.score }} Points
    </h5>
  </div>
</template>
