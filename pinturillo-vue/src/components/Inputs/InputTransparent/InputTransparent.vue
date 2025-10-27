<script setup lang="ts">
const props = defineProps<{
  id: string;
  placeholder: string;
  modelValue: string;
  labelValue?: string;
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
  <div class="flex flex-col w-full h-full">
    <label :for="props.id" class="text-2xl text-white" v-if="props.labelValue">{{ props.labelValue }}</label>
    <input type="text" :id="props.id" :name="props.id" :placeholder="props.placeholder" :value="props.modelValue"
      @input="onInput" :class="[
        'bg-primary text-white rounded-lg bg-opacity-50 border-solid border-primary border-[.2rem] outline-none transition-all placeholder:text-white focus:border-quaternary',
        props.class,
      ]" />
  </div>
</template>
