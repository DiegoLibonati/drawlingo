<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from "vue";

import type { Message } from "@/types/app";
import { EVENTS_SOCKET_SERVER } from "@/types/enums";

import MessageChat from "@/components/Chats/MessageChat/MessageChat.vue";
import FormChatGame from "@/components/Forms/FormChatGame/FormChatGame.vue";

import { useUserStore } from "@/stores/useUserStore";
import { useRoomStore } from "@/stores/useRoomStore";

import socket from "@/socket";

import assets from "@/assets/index";

const roomStore = useRoomStore();
const userStore = useUserStore();

const messages = ref<Message[]>([]);

onMounted(() => {
  socket.on(EVENTS_SOCKET_SERVER.SEND_MESSAGE_GAME, (message: Message) => {
    if (!message.success) {
      messages.value.push(message);
      return;
    }

    if (userStore.id === message.user.id) {
      const audio = new Audio(assets.audios.SuccessMp3);
      void audio.play();
    }
  });
});

onBeforeUnmount(() => {
  socket.off(EVENTS_SOCKET_SERVER.SEND_MESSAGE_GAME);
});

watch(
  () => roomStore.countdownGame,
  (newValue, _) => {
    if (newValue === 0) {
      messages.value = [];
    }
  }
);
</script>

<template>
  <div class="h-[85%] w-full overflow-auto bg-secondary rounded-lg p-2">
    <MessageChat
      v-for="msg in messages"
      :key="msg.id"
      :username="msg.user.username"
      :message="msg.message"
      :classUsername="msg.user.id === userStore.id ? 'text-primary font-bold' : 'text-white'"
    ></MessageChat>
  </div>
  <FormChatGame></FormChatGame>
</template>
