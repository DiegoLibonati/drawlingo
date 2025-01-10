<script setup lang="ts">
import { ButtonHTMLAttributes } from "vue";

const props = defineProps<{
  type: ButtonHTMLAttributes["type"];
  class?: string;
  click?: () => void;
}>();
</script>

<template>
  <button
    :class="[
      'w-full bg-primary rounded-lg p-2 text-white  cursor-pointer transition-all tracking-wide active:scale-90 hover:bg-opacity-75',
      props.class,
    ]"
    :type="props.type"
    @click="props.click"
  >
    <slot></slot>
  </button>
</template>
