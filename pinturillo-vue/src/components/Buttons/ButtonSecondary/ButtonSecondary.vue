<script setup lang="ts">
import { ButtonHTMLAttributes } from "vue";

const props = defineProps<{
  type: ButtonHTMLAttributes["type"];
  class?: string | string[];
  click?: () => void;
}>();
</script>

<template>
  <button
    :class="[
      'w-full bg-secondary tracking-wide text-white font-semibold rounded-lg transition-all active:scale-90 hover:bg-opacity-75',
      props.class,
    ]"
    :type="props.type"
    @click="props.click"
  >
    <slot></slot>
  </button>
</template>
