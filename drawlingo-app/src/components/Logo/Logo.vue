<script setup lang="ts">
import { useRouter } from "vue-router";

import socket from "@/socket";

import assets from "@/assets/index";

defineOptions({ name: "AppLogo" });

const router = useRouter();

const handleRedirectHome = (): void => {
  socket.disconnect();
  void router.push("/");
};
</script>

<template>
  <button class="flex flex-row relative" type="button" @click="handleRedirectHome">
    <h2 class="font-semibold text-4xl text-white z-[10] font-playwrite">Drawlingo</h2>
    <img :src="assets.images.VueSvg" alt="VueJS logo" class="absolute -right-5 z-[5]" />
  </button>
</template>
