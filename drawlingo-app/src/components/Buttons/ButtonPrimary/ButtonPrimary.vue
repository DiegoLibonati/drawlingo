<script setup lang="ts">
import type { ButtonPrimaryProps } from "@/types/props";

const props = defineProps<ButtonPrimaryProps>();
</script>

<template>
  <button
    :class="[
      'w-full bg-primary rounded-lg p-2 text-white  cursor-pointer transition-all tracking-wide active:scale-90 hover:bg-opacity-75',
      props.class,
    ]"
    :type="props.type"
    @click="props.click?.()"
  >
    <slot></slot>
  </button>
</template>
