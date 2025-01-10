<script setup lang="ts">
import { onBeforeUnmount, onMounted } from "vue";
import { useRouter } from "vue-router";

import { EVENTS_SOCKET_SERVER } from "@/entities/enums";

import SectionFormCreateRoom from "@/containers/CreateRoomPage/Sections/SectionFormCreateRoom.vue";

import MainLayout from "@/layouts/MainLayout/MainLayout.vue";

import socket from "@/socket";

const router = useRouter();

onMounted(() => {
  socket.on(EVENTS_SOCKET_SERVER.CREATE_ROOM, (idRoom: string) => {
    router.push(`/room/lobby/${idRoom}`);
  });
});

onBeforeUnmount(() => {
  socket.off(EVENTS_SOCKET_SERVER.CREATE_ROOM);
});
</script>

<template>
  <MainLayout layout-type="flex" class="flex-col items-center justify-center">
    <SectionFormCreateRoom></SectionFormCreateRoom>
  </MainLayout>
</template>
