<script setup lang="ts">
import { Player } from "@src/entities/app";

import { useUserStore } from "@src/stores/useUserStore";

import assets from "@src/assets/export";

const userStore = useUserStore();

const props = defineProps<{
  position: number;
  player: Player;
}>();
</script>

<template>
  <div class="flex relative flex-row items-center justify-between w-full rounded-lg bg-secondary p-2">
    <div class="flex relative flex-row items-center justify-center h-full w-auto z-20">
      <h2 class="text-6xl text-primary font-bold">{{ props.position }}</h2>
      <div class="flex flex-col items-start justify-center ml-2">
        <h3 :class="[
          `text-xl font-semibold overflow-hidden truncate w-12 xl:w-24 2xl:w-36 ${props.player.id === userStore.id ? 'text-tertiary' : 'text-white'
          }`,
        ]">
          {{ props.player.username }}
        </h3>
        <h4 :class="[
          `text-xl text-white font-semibold ${props.player.id === userStore.id ? 'text-tertiary' : 'text-white'
          }`,
        ]">
          {{ props.player.score }}
        </h4>
      </div>
    </div>
    <img :src="assets.images.PintoPng" alt="player painted" class="w-8 h-8 object-contain"
      v-if="!props.player.isPainting && props.player.alreadyPainted" />
    <img :src="assets.images.PintandoPng" alt="player painting" class="w-8 h-8 object-contain"
      v-if="props.player.isPainting && !props.player.alreadyPainted" />
    <img :src="assets.images.PintoPng" alt="player painted" class="grayscale w-8 h-8 object-contain"
      v-if="!props.player.isPainting && !props.player.alreadyPainted" />
    <img :src="assets.images.StarPng" alt="star guess" class="absolute right-10 w-16 h-16 object-contain"
      v-if="props.player.guessed" />
  </div>
</template>
