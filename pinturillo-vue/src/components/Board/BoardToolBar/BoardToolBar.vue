<script setup lang="ts">
import { ref, watchEffect } from "vue";

import { EVENTS_SOCKET_CLIENT } from "@src/entities/enums";
import { FormCanvas } from "@src/entities/forms";

import ButtonSecondary from "@src/components/Buttons/ButtonSecondary/ButtonSecondary.vue";
import InputColor from "@src/components/Inputs/InputColor/InputColor.vue";
import InputRange from "@src/components/Inputs/InputRange/InputRange.vue";

import { useCanvasStore } from "@src/stores/useCanvasStore";
import { useRoomStore } from "@src/stores/useRoomStore";

import socket from "@src/socket";


const INITIAL_VALUE_FORM: FormCanvas = {
  size: 0.1,
  color: "#000",
};

const canvasStore = useCanvasStore();
const roomStore = useRoomStore();

const form = ref<FormCanvas>(INITIAL_VALUE_FORM);

const handleButtonClear = () => {
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
    <input-color class="mr-2" v-model="form.color"></input-color>
    <input-range class="mr-2" v-model="form.size"></input-range>
    <button-secondary class="[&&]:w-16 h-full" type="button" :click="handleButtonClear">Clear</button-secondary>
  </div>
</template>
