<script setup lang="ts">
import { onBeforeUnmount, onMounted } from "vue";

import { Lobby } from "@src/entities/app";
import { EVENTS_SOCKET_CLIENT, EVENTS_SOCKET_SERVER } from "@src/entities/enums";

import MainLayout from "@src/layouts/MainLayout/MainLayout.vue";

import SectionLobbyRooms from "@src/components/Sections/SectionLobbyRooms/SectionLobbyRooms.vue";
import SectionLobbyChat from "@src/components/Sections/SectionLobbyChat/SectionLobbyChat.vue";

import { useUserStore } from "@src/stores/useUserStore";
import { useLobbyStore } from "@src/stores/useLobbyStore";

import socket from "@src/socket";

const userStore = useUserStore();
const lobbyStore = useLobbyStore();

const handleJoinLobby = () => {
  socket.emit(EVENTS_SOCKET_CLIENT.JOIN_LOBBY);

  socket.on(EVENTS_SOCKET_SERVER.UPDATE_LOBBY, (lobby: Lobby) => {
    lobbyStore.setLobby(lobby);
    userStore.updateUserRoom(lobby.id);
  });
};

onMounted(() => handleJoinLobby());

onBeforeUnmount(() => {
  socket.off(EVENTS_SOCKET_SERVER.UPDATE_LOBBY);
});
</script>

<template>
  <main-layout layoutType="flex" class="flex-row items-center justify-center">
    <section-lobby-rooms></section-lobby-rooms>
    <section-lobby-chat></section-lobby-chat>
  </main-layout>
</template>
