<script setup lang="ts">
import { onBeforeUnmount, onMounted } from "vue";
import { useRouter } from "vue-router";

import { User } from "@src/entities/app";
import { EVENTS_SOCKET_SERVER } from "@src/entities/enums";

import SectionFormNickname from "@src/components/Sections/SectionFormNickname/SectionFormNickname.vue";

import MainLayout from "@src/layouts/MainLayout/MainLayout.vue";

import { useUserStore } from "@src/stores/useUserStore";

import socket from "@src/socket";

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
  <main-layout layout-type="flex" class="items-center justify-center">
    <section-form-nickname></section-form-nickname>
  </main-layout>
</template>
