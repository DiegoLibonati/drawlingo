<script setup lang="ts">
import type { CardPlayerRoomLobbyProps } from "@/types/props";

const props = defineProps<CardPlayerRoomLobbyProps>();
</script>

<template>
  <div
    :class="[
      'flex flex-row justify-between items-center bg-primary rounded-lg w-full p-2',
      props.class,
    ]"
  >
    <h2 class="text-white text-lg font-semibold tracking-wide">
      {{ props.username }}
    </h2>
    <v-icon v-if="props.isOwner" name="fa-crown" class="fill-white"></v-icon>
  </div>
</template>
