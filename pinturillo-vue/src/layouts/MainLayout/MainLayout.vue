<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";

import Mobile from "@/components/Mobile/Mobile.vue";

const props = defineProps<{ class: string; layoutType: "flex" | "grid" }>();
const route = useRoute();

const mainClass = computed(() => {
  const baseLayoutType = props.layoutType;
  const baseClass = `flex w-full bg-secondary lg:${baseLayoutType}`;
  const heightClass = route.path.includes("game")
    ? "h-screen"
    : "h-[calc(100vh_-_5rem)]";

  return `${baseClass} ${heightClass} ${props.class}`;
});
</script>

<template>
  <main :class="mainClass">
    <slot></slot>
    <Mobile></Mobile>
  </main>
</template>
