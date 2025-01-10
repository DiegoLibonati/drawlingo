<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";

import { Room } from "@/entities/entities";
import { EVENTS_SOCKET_CLIENT, EVENTS_SOCKET_SERVER } from "@/entities/enums";

import MainLayout from "@/layouts/MainLayout/MainLayout.vue";

import SectionGame from "@/containers/GamePage/Sections/SectionGame.vue";

import socket from "@/socket";
import { useRoomStore } from "@/stores/room/room";
import { useCanvasStore } from "@/stores/canvas/canvas";
import { useUserStore } from "@/stores/user/user";
import { useAlertStore } from "@/stores/alert/alert";

const timeout = ref<NodeJS.Timeout | null>(null);

const router = useRouter();

const userStore = useUserStore();
const roomStore = useRoomStore();
const canvasStore = useCanvasStore();
const alertStore = useAlertStore();

onMounted(() => {
  socket.emit(EVENTS_SOCKET_CLIENT.JOIN_GAME, roomStore.id);

  socket.on(EVENTS_SOCKET_SERVER.UPDATE_GAME, (room: Room) => {
    roomStore.setRoom(room);

    if (
      !roomStore.playerChoosingWord &&
      roomStore.started &&
      roomStore.countdownGame === roomStore.countdownSelected
    ) {
      socket.emit(EVENTS_SOCKET_CLIENT.COUTNDOWN_GAME, roomStore.id);
    }
  });

  socket.on(EVENTS_SOCKET_SERVER.CANVAS_IMAGE_GAME, (dataUrl: string) => {
    const image = new Image();
    image.src = dataUrl;

    image.onload = () => {
      const ctx = canvasStore.canvasContext;
      const canvasSizes = canvasStore.canvasSizes;

      const x = (canvasSizes.width - image.width) / 2;
      const y = (canvasSizes.height - image.height) / 2;

      ctx.clearRect(0, 0, canvasSizes.width, canvasSizes.height);

      ctx.drawImage(image, x, y);
    };
  });

  socket.on(EVENTS_SOCKET_SERVER.CANVAS_CLEAR_GAME, () => {
    const ctx = canvasStore.canvasContext;
    const canvasSizes = canvasStore.canvasSizes;

    ctx.clearRect(0, 0, canvasSizes.width, canvasSizes.height);
  });

  socket.on(EVENTS_SOCKET_SERVER.DISCONNECT, (reason: string) => {
    alertStore.setAlert({
      type: "info",
      message: `The room was closed for the following reason: ${reason}`,
    });
    socket.disconnect();
    router.push("/");
  });

  socket.on(EVENTS_SOCKET_SERVER.NEW_PAINTER_GAME, () => {
    if (userStore.id !== roomStore.owner.id) return;

    return socket.emit(EVENTS_SOCKET_CLIENT.NEW_PAINTER_GAME, roomStore.id);
  });

  socket.on(EVENTS_SOCKET_SERVER.NEXT_ROUND_GAME, () => {
    if (userStore.id !== roomStore.owner.id) return;

    return socket.emit(EVENTS_SOCKET_CLIENT.NEXT_ROUND_GAME, roomStore.id);
  });

  socket.on(EVENTS_SOCKET_SERVER.FINISH_GAME, () => {
    router.push("/score");
  });
});

onBeforeUnmount(() => {
  socket.off(EVENTS_SOCKET_SERVER.UPDATE_GAME);
  socket.off(EVENTS_SOCKET_SERVER.CANVAS_IMAGE_GAME);
  socket.off(EVENTS_SOCKET_SERVER.CANVAS_CLEAR_GAME);
  socket.off(EVENTS_SOCKET_SERVER.DISCONNECT);
  socket.off(EVENTS_SOCKET_SERVER.NEW_PAINTER_GAME);
  socket.off(EVENTS_SOCKET_SERVER.NEXT_ROUND_GAME);
  socket.off(EVENTS_SOCKET_SERVER.FINISH_GAME);

  if (timeout.value) {
    clearTimeout(timeout.value);
    timeout.value = null;
  }
});

watch(
  () => roomStore.countdownGame,
  (newValue, oldValue) => {
    if (newValue !== oldValue) {
      if (timeout.value) {
        clearTimeout(timeout.value);
        timeout.value = null;
      }

      if (
        !roomStore.playerChoosingWord &&
        roomStore.playerPaitingWord &&
        roomStore.playerPaitingWord.id === userStore.id
      ) {
        timeout.value = setTimeout(() => {
          socket.emit(EVENTS_SOCKET_CLIENT.COUTNDOWN_GAME, roomStore.id);
        }, 1000);
      }
    }
  }
);
</script>

<template>
  <MainLayout layoutType="flex" class="flex-col items-center justify-center">
    <SectionGame></SectionGame>
  </MainLayout>
</template>
