<script setup lang="ts">
import type { ButtonSecondaryProps } from "@/types/props";

const props = defineProps<ButtonSecondaryProps>();
</script>

<template>
  <button
    :class="[
      'w-full bg-secondary tracking-wide text-white font-semibold rounded-lg transition-all active:scale-90 hover:bg-opacity-75',
      props.class,
    ]"
    :type="props.type"
    @click="props.click?.()"
  >
    <slot></slot>
  </button>
</template>
