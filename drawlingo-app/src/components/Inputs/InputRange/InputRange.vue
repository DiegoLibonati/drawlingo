<script setup lang="ts">
import type { InputRangeProps } from "@/types/props";

const props = defineProps<InputRangeProps>();

const emit = defineEmits<(e: "update:modelValue", value: string) => void>();

const onInput = (event: Event): void => {
  const target = event.target as HTMLInputElement;
  emit("update:modelValue", target.value);
};
</script>

<template>
  <input
    type="range"
    :class="['w-16', props.class]"
    min="0.1"
    max="10"
    step="0.1"
    :value="props.modelValue"
    @input="onInput"
  />
</template>
