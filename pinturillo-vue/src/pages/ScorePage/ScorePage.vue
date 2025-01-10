<script setup lang="ts">
import { onBeforeUnmount, onMounted } from "vue";
import { useRouter } from "vue-router";

import { Room } from "@/entities/entities";
import { EVENTS_SOCKET_SERVER } from "@/entities/enums";

import MainLayout from "@/layouts/MainLayout/MainLayout.vue";

import SectionPlayersScore from "@/containers/ScorePage/Sections/SectionPlayersScore.vue";

import socket from "@/socket";
import { useAlertStore } from "@/stores/alert/alert";
import { useRoomStore } from "@/stores/room/room";

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
  <MainLayout layout-type="flex" class="flex-col items-center justify-center">
    <SectionPlayersScore></SectionPlayersScore>
  </MainLayout>
</template>
