<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, VNodeRef } from "vue";

import { EVENTS_SOCKET_CLIENT } from "@src/entities/enums";

import BoardToolBar from "@src/components/Board/BoardToolBar/BoardToolBar.vue";

import { useCanvasStore } from "@src/stores/useCanvasStore";
import { useRoomStore } from "@src/stores/useRoomStore";
import { useUserStore } from "@src/stores/useUserStore";

import socket from "@src/socket";

const userStore = useUserStore();
const roomStore = useRoomStore();
const canvasStore = useCanvasStore();

const canvasRef = ref<VNodeRef | undefined>(undefined);

const handleMouseDown = (e: MouseEvent) => {
  const canvasRect = canvasStore.canvasRect;

  if (
    roomStore.playerPaitingWord &&
    roomStore.playerPaitingWord.id === userStore.id
  ) {
    canvasStore.setCanDraw(true);
  }

  if (e instanceof MouseEvent) {
    canvasStore.setPos({
      x: e.clientX - canvasRect.left,
      y: e.clientY - canvasRect.top,
    });
  }
};

const handleMouseMove = (e: MouseEvent) => {
  const ctx = canvasStore.canvasContext;

  if (canvasStore.canDraw) {
    const canvasRect = canvasStore.canvasRect;

    ctx!.beginPath();
    ctx!.moveTo(canvasStore.pos.x, canvasStore.pos.y);

    if (e instanceof MouseEvent) {
      canvasStore.setPos({
        x: e.clientX - canvasRect.left,
        y: e.clientY - canvasRect.top,
      });
    }

    ctx!.strokeStyle = canvasStore.color;
    ctx!.lineWidth = canvasStore.size;
    ctx!.lineCap = "round";

    ctx!.lineTo(canvasStore.pos.x, canvasStore.pos.y);
    ctx!.stroke();
    ctx!.closePath();

    socket.emit(EVENTS_SOCKET_CLIENT.CANVAS_IMAGE_GAME, {
      idRoom: roomStore.id,
      dataUrl: canvasRef.value.toDataURL(),
    });
  }
};

const handleMouseUp = () => {
  if (canvasStore.canDraw) {
    const ctx = canvasStore.canvasContext;

    canvasStore.setCanDraw(false);
    ctx.beginPath();
  }
};

const handleMouseLeave = () => {
  if (canvasStore.canDraw) {
    const ctx = canvasStore.canvasContext;

    canvasStore.setCanDraw(false);
    ctx.beginPath();
  }
};

const handleResize = () => {
  const canvas = canvasRef.value as HTMLCanvasElement;
  const ctx = canvasStore.canvasContext;
  const canvasSizes = canvasStore.canvasSizes;

  const imgData = ctx.getImageData(0, 0, canvasSizes.width, canvasSizes.height);

  canvas.width = canvasSizes.width;
  canvas.height = canvasSizes.height;

  ctx.putImageData(imgData, 0, 0);
};

onMounted(() => {
  const canvas = canvasRef.value as HTMLCanvasElement;

  if (canvas) {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    canvasStore.setCanvas(canvas);
  }

  window?.addEventListener("resize", handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
});
</script>

<template>
  <div class="flex flex-col items-center justify-start w-full h-full p-2">
    <div :class="[
      `flex flex-col items-center justify-start w-full h-32  p-2 rounded-tr-lg rounded-tl-lg`,
      roomStore.currentPlayerGuessed ? 'bg-green-400' : 'bg-secondary',
    ]" data-testid="word-container">
      <div class="flex relative items-center justify-center w-full h-full">
        <h2 class="text-2xl font-semibold text-white">
          {{
            (roomStore.playerPaitingWord &&
              roomStore.playerPaitingWord.id === userStore.id) ||
              roomStore.currentPlayerGuessed
              ? roomStore.wordToGuess.actualWord
              : roomStore.wordToGuess.wordWithPlaceholder
          }}
        </h2>
        <h3
          class="flex items-center justify-center absolute right-0 text-white rounded-full bg-primary font-semibold w-8 h-8">
          {{ roomStore.countdownGame }}
        </h3>
      </div>
      <board-tool-bar v-if="
        roomStore.playerPaitingWord &&
        roomStore.playerPaitingWord.id === userStore.id
      "></board-tool-bar>
    </div>
    <div class="w-full h-full rounded-br-lg rounded-bl-lg">
      <canvas class="bg-white w-full h-full rounded-br-lg rounded-bl-lg" ref="canvasRef" @mousedown="handleMouseDown"
        @mousemove="handleMouseMove" @mouseup="handleMouseUp" @mouseleave="handleMouseLeave"></canvas>
    </div>
  </div>
</template>
