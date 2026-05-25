<script setup lang="ts">
import { onBeforeUnmount, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

import type { Room } from "@/types/app";
import { EVENTS_SOCKET_CLIENT, EVENTS_SOCKET_SERVER } from "@/types/enums";

import MainLayout from "@/layouts/MainLayout/MainLayout.vue";

import SectionLobbyRoom from "@/components/Sections/SectionLobbyRoom/SectionLobbyRoom.vue";

import { useRoomStore } from "@/stores/useRoomStore";
import { useAlertStore } from "@/stores/useAlertStore";

import socket from "@/socket";

const route = useRoute();
const router = useRouter();

const roomStore = useRoomStore();
const alertStore = useAlertStore();

onMounted(() => {
  socket.on(EVENTS_SOCKET_SERVER.UPDATE_ROOM_LOBBY, (room: Room) => {
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
  socket.on(EVENTS_SOCKET_SERVER.START_GAME, () => {
    void router.push("/game");
  });

  socket.emit(
    EVENTS_SOCKET_CLIENT.JOIN_ROOM_LOBBY,
    route.params.id,
    (response: { ok: boolean; data?: Room }) => {
      if (response.ok && response.data) {
        roomStore.setRoom(response.data);
      }
    }
  );
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
