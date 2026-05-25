<script setup lang="ts">
import type { InputSecondaryProps } from "@/types/props";

const props = defineProps<InputSecondaryProps>();

const emit = defineEmits<(e: "update:modelValue", value: string) => void>();

const onInput = (event: Event): void => {
  const target = event.target as HTMLInputElement;
  emit("update:modelValue", target.value);
};
</script>

<template>
  <input
    :id="props.id"
    :type="props.type"
    :name="props.id"
    :placeholder="props.placeholder"
    :value="props.modelValue"
    :class="[
      'w-full rounded-lg bg-secondary border-secondary border-[.2rem] px-2 text-white text-lg outline-none transition-all placeholder:text-white focus:border-quaternary',
      props.class,
    ]"
    @input="onInput"
  />
</template>
