<script setup lang="ts">
import { onBeforeUnmount, onMounted } from "vue";
import { useRouter } from "vue-router";

import { User } from "@src/entities/entities";
import { EVENTS_SOCKET_SERVER } from "@src/entities/enums";

import SectionFormNickname from "@src/containers/HomePage/Sections/SectionFormNickname.vue";

import MainLayout from "@src/layouts/MainLayout/MainLayout.vue";

import socket from "@src/socket";
import { useUserStore } from "@src/stores/user/user";

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
