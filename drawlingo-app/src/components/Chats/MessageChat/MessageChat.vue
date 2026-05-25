<script setup lang="ts">
import type { MessageChatProps } from "@/types/props";

const props = defineProps<MessageChatProps>();
</script>

<template>
  <h2 class="text-white font-semibold text-lg">
    <span :class="['', props.classUsername]">{{ props.username }}: </span>{{ props.message }}
  </h2>
</template>
