<script setup lang="ts">
import { onBeforeUnmount, onMounted } from "vue";

import { Lobby } from "@/entities/entities";
import { EVENTS_SOCKET_CLIENT, EVENTS_SOCKET_SERVER } from "@/entities/enums";

import MainLayout from "@/layouts/MainLayout/MainLayout.vue";

import SectionLobbyRooms from "@/containers/LobbyPage/Sections/SectionLobbyRooms.vue";
import SectionLobbyChat from "@/containers/LobbyPage/Sections/SectionLobbyChat.vue";

import socket from "@/socket";
import { useUserStore } from "@/stores/user/user";
import { useLobbyStore } from "@/stores/lobby/lobby";

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
  <MainLayout layoutType="flex" class="flex-row items-center justify-center">
    <SectionLobbyRooms></SectionLobbyRooms>
    <SectionLobbyChat></SectionLobbyChat>
  </MainLayout>
</template>
