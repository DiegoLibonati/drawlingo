<script setup lang="ts">
import { onBeforeUnmount, onMounted } from "vue";

import type { Lobby } from "@/types/app";
import { EVENTS_SOCKET_CLIENT, EVENTS_SOCKET_SERVER } from "@/types/enums";

import MainLayout from "@/layouts/MainLayout/MainLayout.vue";

import SectionLobbyRooms from "@/components/Sections/SectionLobbyRooms/SectionLobbyRooms.vue";
import SectionLobbyChat from "@/components/Sections/SectionLobbyChat/SectionLobbyChat.vue";

import { useUserStore } from "@/stores/useUserStore";
import { useLobbyStore } from "@/stores/useLobbyStore";

import socket from "@/socket";

const userStore = useUserStore();
const lobbyStore = useLobbyStore();

const handleJoinLobby = (): void => {
  socket.on(EVENTS_SOCKET_SERVER.UPDATE_LOBBY, (lobby: Lobby) => {
    lobbyStore.setLobby(lobby);
  });

  socket.emit(EVENTS_SOCKET_CLIENT.JOIN_LOBBY, (response: { ok: boolean; data?: Lobby }) => {
    if (response.ok && response.data) {
      lobbyStore.setLobby(response.data);
      userStore.updateUserRoom(response.data.id);
    }
  });
};

onMounted(() => {
  handleJoinLobby();
});

onBeforeUnmount(() => {
  socket.off(EVENTS_SOCKET_SERVER.UPDATE_LOBBY);
});
</script>

<template>
  <MainLayout layoutType="flex" class="flex-row items-center justify-center">
    <SectionLobbyRooms></SectionLobbyRooms>
    <SectionLobbyChat></SectionLobbyChat>
  </MainLayout>
</template>
