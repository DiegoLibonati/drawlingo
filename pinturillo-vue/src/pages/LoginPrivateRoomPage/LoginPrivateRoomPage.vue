<script setup lang="ts">
import { onBeforeUnmount, onMounted } from "vue";
import { useRouter } from "vue-router";

import { EVENTS_SOCKET_SERVER } from "@/entities/enums";

import MainLayout from "@/layouts/MainLayout/MainLayout.vue";

import SectionLoginPrivateRoom from "@/containers/LoginPrivateRoomPage/Sections/SectionLoginPrivateRoom.vue";

import socket from "@/socket";
import { useAlertStore } from "@/stores/alert/alert";

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
  <MainLayout layout-type="flex" class="flex-col items-center justify-center">
    <SectionLoginPrivateRoom></SectionLoginPrivateRoom>
  </MainLayout>
</template>
