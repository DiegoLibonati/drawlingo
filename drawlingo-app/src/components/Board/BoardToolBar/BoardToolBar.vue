<script setup lang="ts">
import { ref, watchEffect } from "vue";

import { EVENTS_SOCKET_CLIENT } from "@/types/enums";
import type { FormCanvas } from "@/types/forms";

import ButtonSecondary from "@/components/Buttons/ButtonSecondary/ButtonSecondary.vue";
import InputColor from "@/components/Inputs/InputColor/InputColor.vue";
import InputRange from "@/components/Inputs/InputRange/InputRange.vue";

import { useCanvasStore } from "@/stores/useCanvasStore";
import { useRoomStore } from "@/stores/useRoomStore";

import socket from "@/socket";

const INITIAL_VALUE_FORM: FormCanvas = {
  size: 0.1,
  color: "#000",
};

const canvasStore = useCanvasStore();
const roomStore = useRoomStore();

const form = ref<FormCanvas>(INITIAL_VALUE_FORM);

const handleButtonClear = (): void => {
  const ctx = canvasStore.canvasContext;
  const canvasSizes = canvasStore.canvasSizes;

  ctx.clearRect(0, 0, canvasSizes.width, canvasSizes.height);

  socket.emit(EVENTS_SOCKET_CLIENT.CANVAS_CLEAR_GAME, roomStore.id);
};

watchEffect(() => {
  const formCanvas = form.value;

  canvasStore.setColor(formCanvas.color);
  canvasStore.setSize(formCanvas.size);
});
</script>

<template>
  <div class="flex flex-row items-center justify-start w-full bg-primary rounded-lg p-2 h-full">
    <InputColor v-model="form.color" class="mr-2"></InputColor>
    <InputRange v-model="form.size" class="mr-2"></InputRange>
    <ButtonSecondary class="[&&]:w-16 h-full" type="button" :click="handleButtonClear"
      >Clear</ButtonSecondary
    >
  </div>
</template>
