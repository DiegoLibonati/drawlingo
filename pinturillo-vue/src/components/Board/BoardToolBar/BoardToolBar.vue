<script setup lang="ts">
import { ref, watchEffect } from "vue";

import { EVENTS_SOCKET_CLIENT } from "@/entities/enums";

import ButtonSecondary from "@/components/Buttons/ButtonSecondary/ButtonSecondary.vue";
import InputColor from "@/components/Inputs/InputColor/InputColor.vue";
import InputRange from "@/components/Inputs/InputRange/InputRange.vue";

import socket from "@/socket";
import { useCanvasStore } from "@/stores/canvas/canvas";
import { useRoomStore } from "@/stores/room/room";

type FormCanvas = {
  size: number;
  color: string;
};

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
  <div
    class="flex flex-row items-center justify-start w-full bg-primary rounded-lg p-2 h-full"
  >
    <InputColor class="mr-2" v-model="form.color"></InputColor>
    <InputRange class="mr-2" v-model="form.size"></InputRange>
    <ButtonSecondary
      class="[&&]:w-16 h-full"
      type="button"
      :click="handleButtonClear"
      >Clear</ButtonSecondary
    >
  </div>
</template>
