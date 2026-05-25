<script setup lang="ts">
import { EVENTS_SOCKET_CLIENT } from "@/types/enums";

import ButtonSecondary from "@/components/Buttons/ButtonSecondary/ButtonSecondary.vue";

import ArticleLobbyRoomInformation from "@/components/Articles/ArticleLobbyRoomInformation/ArticleLobbyRoomInformation.vue";
import ArticleLobbyRoomPlayers from "@/components/Articles/ArticleLobbyRoomPlayers/ArticleLobbyRoomPlayers.vue";

import { useUserStore } from "@/stores/useUserStore";
import { useRoomStore } from "@/stores/useRoomStore";

import socket from "@/socket";

const roomStore = useRoomStore();
const userStore = useUserStore();

const handleStartGame = (): void => {
  socket.emit(EVENTS_SOCKET_CLIENT.START_GAME, roomStore.id);
};
</script>

<template>
  <section
    class="hidden flex-col items-center justify-between w-[30rem] h-[30rem] bg-primary rounded-lg p-2 shadow-md lg:flex"
  >
    <ArticleLobbyRoomInformation></ArticleLobbyRoomInformation>
    <ArticleLobbyRoomPlayers></ArticleLobbyRoomPlayers>
    <ButtonSecondary
      v-if="userStore.id === roomStore.owner.id"
      :class="[
        `mt-2 p-2 ${roomStore.playersLength <= 1 ? 'cursor-not-allowed' : 'cursor-pointer'}`,
      ]"
      :click="handleStartGame"
      :disabled="roomStore.playersLength <= 1"
      type="button"
    >
      {{ roomStore.playersLength <= 1 ? "Waiting for more players..." : "¡Start Game!" }}
    </ButtonSecondary>
  </section>
</template>
