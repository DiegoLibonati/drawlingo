<script setup lang="ts">
import type { InputTransparentProps } from "@/types/props";

const props = defineProps<InputTransparentProps>();

const emit = defineEmits<(e: "update:modelValue", value: string) => void>();

const onInput = (event: Event): void => {
  const target = event.target as HTMLInputElement;
  emit("update:modelValue", target.value);
};
</script>

<template>
  <div class="flex flex-col w-full h-full">
    <label v-if="props.labelValue" :for="props.id" class="text-2xl text-white">{{
      props.labelValue
    }}</label>
    <input
      :id="props.id"
      type="text"
      :name="props.id"
      :placeholder="props.placeholder"
      :value="props.modelValue"
      :class="[
        'bg-primary text-white rounded-lg bg-opacity-50 border-solid border-primary border-[.2rem] outline-none transition-all placeholder:text-white focus:border-quaternary',
        props.class,
      ]"
      @input="onInput"
    />
  </div>
</template>
