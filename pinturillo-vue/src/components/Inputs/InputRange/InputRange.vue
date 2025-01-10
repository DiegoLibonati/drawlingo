<script setup lang="ts">
const props = defineProps<{
  modelValue: number;
  class?: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const onInput = (event: Event) => {
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
    @input="onInput"
    :value="props.modelValue"
  />
</template>
