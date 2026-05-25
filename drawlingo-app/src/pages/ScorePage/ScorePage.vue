<script setup lang="ts">
import { onBeforeUnmount, onMounted } from "vue";
import { useRouter } from "vue-router";

import type { Room } from "@/types/app";
import { EVENTS_SOCKET_SERVER } from "@/types/enums";

import MainLayout from "@/layouts/MainLayout/MainLayout.vue";

import SectionPlayersScore from "@/components/Sections/SectionPlayersScore/SectionPlayersScore.vue";

import { useAlertStore } from "@/stores/useAlertStore";
import { useRoomStore } from "@/stores/useRoomStore";

import socket from "@/socket";

const router = useRouter();

const roomStore = useRoomStore();
const alertStore = useAlertStore();

onMounted(() => {
  socket.on(EVENTS_SOCKET_SERVER.UPDATE_GAME, (room: Room) => {
    roomStore.setRoom(room);
  });

  socket.on(EVENTS_SOCKET_SERVER.DISCONNECT, (reason: string) => {
    alertStore.setAlert({
      type: "info",
      message: `The room was closed for the following reason: ${reason}`,
    });
    socket.disconnect();
    void router.push("/");
  });
});

onBeforeUnmount(() => {
  socket.off(EVENTS_SOCKET_SERVER.UPDATE_GAME);
  socket.off(EVENTS_SOCKET_SERVER.DISCONNECT);
});
</script>

<template>
  <MainLayout layoutType="flex" class="flex-col items-center justify-center">
    <SectionPlayersScore></SectionPlayersScore>
  </MainLayout>
</template>
