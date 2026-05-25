<script setup lang="ts">
import type { InputColorProps } from "@/types/props";

const props = defineProps<InputColorProps>();

const emit = defineEmits<(e: "update:modelValue", value: string) => void>();

const onInput = (event: Event): void => {
  const target = event.target as HTMLInputElement;
  emit("update:modelValue", target.value);
};
</script>

<template>
  <input
    type="color"
    :class="['w-6 h-6 rounded-lg', props.class]"
    :value="props.modelValue"
    @input="onInput"
  />
</template>
