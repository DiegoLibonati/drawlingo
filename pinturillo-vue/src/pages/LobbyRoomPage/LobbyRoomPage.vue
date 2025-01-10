<script setup lang="ts">
import { onBeforeUnmount, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

import { Room } from "@/entities/entities";
import { EVENTS_SOCKET_CLIENT, EVENTS_SOCKET_SERVER } from "@/entities/enums";

import MainLayout from "@/layouts/MainLayout/MainLayout.vue";

import SectionLobbyRoom from "@/containers/LobbyRoomPage/Sections/SectionLobbyRoom.vue";

import socket from "@/socket";
import { useRoomStore } from "@/stores/room/room";
import { useAlertStore } from "@/stores/alert/alert";

const route = useRoute();
const router = useRouter();

const roomStore = useRoomStore();
const alertStore = useAlertStore();

onMounted(() => {
  socket.emit(EVENTS_SOCKET_CLIENT.JOIN_ROOM_LOBBY, route.params.id);

  socket.on(EVENTS_SOCKET_SERVER.UPDATE_ROOM_LOBBY, (room: Room) => {
    roomStore.setRoom(room);
  });
  socket.on(EVENTS_SOCKET_SERVER.DISCONNECT, (reason: string) => {
    alertStore.setAlert({
      type: "info",
      message: `The room was closed for the following reason: ${reason}`,
    });

    socket.disconnect();
    router.push("/");
  });
  socket.on(EVENTS_SOCKET_SERVER.START_GAME, () => {
    router.push("/game");
  });
});

onBeforeUnmount(() => {
  socket.off(EVENTS_SOCKET_SERVER.UPDATE_ROOM_LOBBY);
  socket.off(EVENTS_SOCKET_SERVER.DISCONNECT);
  socket.off(EVENTS_SOCKET_SERVER.START_GAME);
});
</script>

<template>
  <MainLayout layoutType="flex" class="flex-col items-center justify-center">
    <SectionLobbyRoom></SectionLobbyRoom>
  </MainLayout>
</template>
