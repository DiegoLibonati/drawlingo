<script setup lang="ts">
import { onBeforeUnmount, onMounted } from "vue";
import { useRouter } from "vue-router";

import { EVENTS_SOCKET_SERVER } from "@src/entities/enums";

import MainLayout from "@src/layouts/MainLayout/MainLayout.vue";

import SectionLoginPrivateRoom from "@src/components/Sections/SectionLoginPrivateRoom/SectionLoginPrivateRoom.vue";

import { useAlertStore } from "@src/stores/useAlertStore";

import socket from "@src/socket";

const router = useRouter();

const alertStore = useAlertStore();

onMounted(() => {
  socket.on(
    EVENTS_SOCKET_SERVER.LOGIN_PRIVATE_ROOM,
    (response: { success: boolean; message: string; idRoom?: string }) => {
      const { success, message, idRoom } = response;

      if (!success) {
        alertStore.setAlert({ type: "error", message: message });
        return;
      }

      router.push(`/room/lobby/${idRoom}`);
    }
  );
});

onBeforeUnmount(() => {
  socket.off(EVENTS_SOCKET_SERVER.LOGIN_PRIVATE_ROOM);
});
</script>

<template>
  <main-layout layout-type="flex" class="flex-col items-center justify-center">
    <section-login-private-room></section-login-private-room>
  </main-layout>
</template>
