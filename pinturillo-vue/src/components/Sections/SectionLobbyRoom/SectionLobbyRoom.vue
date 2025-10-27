<script setup lang="ts">
import { EVENTS_SOCKET_CLIENT } from "@src/entities/enums";

import ButtonSecondary from "@src/components/Buttons/ButtonSecondary/ButtonSecondary.vue";

import ArticleLobbyRoomInformation from "@src/components/Articles/ArticleLobbyRoomInformation/ArticleLobbyRoomInformation.vue";
import ArticleLobbyRoomPlayers from "@src/components/Articles/ArticleLobbyRoomPlayers/ArticleLobbyRoomPlayers.vue";

import { useUserStore } from "@src/stores/useUserStore";
import { useRoomStore } from "@src/stores/useRoomStore";

import socket from "@src/socket";

const roomStore = useRoomStore();
const userStore = useUserStore();

const handleStartGame = () => {
  socket.emit(EVENTS_SOCKET_CLIENT.START_GAME, roomStore.id);
};
</script>

<template>
  <section
    class="hidden flex-col items-center justify-between w-[30rem] h-[30rem] bg-primary rounded-lg p-2 shadow-md lg:flex">
    <article-lobby-room-information></article-lobby-room-information>
    <article-lobby-room-players></article-lobby-room-players>
    <button-secondary :class="[
      `mt-2 p-2 ${roomStore.playersLength <= 1
        ? 'cursor-not-allowed'
        : 'cursor-pointer'
      }`,
    ]" :click="handleStartGame" v-if="userStore.id === roomStore.owner.id" :disabled="roomStore.playersLength <= 1"
      type="button">
      {{
        roomStore.playersLength <= 1 ? "Waiting for more players..." : "¡Start Game!" }} </button-secondary>
  </section>
</template>
