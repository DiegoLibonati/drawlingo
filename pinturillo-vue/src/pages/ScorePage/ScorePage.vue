<script setup lang="ts">
import { onBeforeUnmount, onMounted } from "vue";
import { useRouter } from "vue-router";

import { Room } from "@src/entities/app";
import { EVENTS_SOCKET_SERVER } from "@src/entities/enums";

import MainLayout from "@src/layouts/MainLayout/MainLayout.vue";

import SectionPlayersScore from "@src/components/Sections/SectionPlayersScore/SectionPlayersScore.vue";

import { useAlertStore } from "@src/stores/useAlertStore";
import { useRoomStore } from "@src/stores/useRoomStore";

import socket from "@src/socket";

const router = useRouter();

const roomStore = useRoomStore();
const alertStore = useAlertStore();

onMounted(() => {
  socket.on(EVENTS_SOCKET_SERVER.UPDATE_GAME, (room: Room) => {
    roomStore.setRoom(room);
  });

  socket.on(EVENTS_SOCKET_SERVER.DISCONNECT, (reason: Room) => {
    alertStore.setAlert({
      type: "info",
      message: `The room was closed for the following reason: ${reason}`,
    });
    socket.disconnect();
    router.push("/");
  });
});

onBeforeUnmount(() => {
  socket.off(EVENTS_SOCKET_SERVER.UPDATE_GAME);
  socket.off(EVENTS_SOCKET_SERVER.DISCONNECT);
});
</script>

<template>
  <main-layout layout-type="flex" class="flex-col items-center justify-center">
    <section-players-score></section-players-score>
  </main-layout>
</template>
