<script setup lang="ts">
import { onBeforeUnmount, onMounted } from "vue";
import { useRouter } from "vue-router";

import { EVENTS_SOCKET_SERVER } from "@src/entities/enums";

import SectionFormCreateRoom from "@src/components/Sections/SectionFormCreateRoom/SectionFormCreateRoom.vue";

import MainLayout from "@src/layouts/MainLayout/MainLayout.vue";

import socket from "@src/socket";

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
  <main-layout layout-type="flex" class="flex-col items-center justify-center">
    <section-form-create-room></section-form-create-room>
  </main-layout>
</template>
