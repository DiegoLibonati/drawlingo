<script setup lang="ts">
import { useRouter } from "vue-router";

import socket from "@/socket";

const router = useRouter();

const handleRedirectHome = () => {
  socket.disconnect();
  router.push("/");
};
</script>

<template>
  <button
    @click="handleRedirectHome"
    class="flex flex-row relative"
    type="button"
  >
    <h2 class="font-semibold text-4xl text-white z-[10] font-playwrite">
      Pinturillo
    </h2>
    <img
      src="@/assets/images/vue.svg"
      alt="VueJS logo"
      class="absolute -right-5 z-[5]"
    />
  </button>
</template>
