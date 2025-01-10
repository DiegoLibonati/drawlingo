<script setup lang="ts">
import { EVENTS_SOCKET_CLIENT } from "@/entities/enums";

import ButtonSecondary from "@/components/Buttons/ButtonSecondary/ButtonSecondary.vue";

import ArticleLobbyRoomInformation from "@/containers/LobbyRoomPage/Articles/ArticleLobbyRoomInformation.vue";
import ArticleLobbyRoomPlayers from "@/containers/LobbyRoomPage/Articles/ArticleLobbyRoomPlayers.vue";

import socket from "@/socket";
import { useUserStore } from "@/stores/user/user";
import { useRoomStore } from "@/stores/room/room";

const roomStore = useRoomStore();
const userStore = useUserStore();

const handleStartGame = () => {
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
      :class="[
        `mt-2 p-2 ${
          roomStore.playersLength <= 1
            ? 'cursor-not-allowed'
            : 'cursor-pointer'
        }`,
      ]"
      :click="handleStartGame"
      v-if="userStore.id === roomStore.owner.id"
      :disabled="roomStore.playersLength <= 1"
      type="button"
    >
      {{
        roomStore.playersLength <= 1
          ? "Waiting for more players..."
          : "¡Start Game!"
      }}
    </ButtonSecondary>
  </section>
</template>
