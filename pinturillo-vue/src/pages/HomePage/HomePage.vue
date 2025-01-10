<script setup lang="ts">
import { onBeforeUnmount, onMounted } from "vue";
import { useRouter } from "vue-router";

import { User } from "@/entities/entities";
import { EVENTS_SOCKET_SERVER } from "@/entities/enums";

import SectionFormNickname from "@/containers/HomePage/Sections/SectionFormNickname.vue";

import MainLayout from "@/layouts/MainLayout/MainLayout.vue";

import socket from "@/socket";
import { useUserStore } from "@/stores/user/user";

const userStore = useUserStore();
const router = useRouter();

onMounted(() => {
  socket.on(
    EVENTS_SOCKET_SERVER.CONNECT,
    ({ user, pathToRedirect }: { user: User; pathToRedirect: string }) => {
      userStore.login(user);
      router.push(pathToRedirect);
    }
  );
});

onBeforeUnmount(() => {
  socket.off(EVENTS_SOCKET_SERVER.CONNECT);
});
</script>

<template>
  <MainLayout layout-type="flex" class="items-center justify-center">
    <SectionFormNickname></SectionFormNickname>
  </MainLayout>
</template>
