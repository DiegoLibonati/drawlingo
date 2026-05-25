<script setup lang="ts">
defineOptions({ name: "MobileView" });

import Logo from "@/components/Logo/Logo.vue";
</script>

<template>
  <section class="flex flex-col items-center justify-center w-auto h-full lg:hidden">
    <Logo></Logo>
    <h2 class="text-center mt-2 text-white text-lg">
      This version of drawlingo is not available for touch devices.
    </h2>
  </section>
</template>
