<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from "vue";

import { Message } from "@src/entities/app";
import { EVENTS_SOCKET_SERVER } from "@src/entities/enums";

import MessageChat from "@src/components/Chats/MessageChat/MessageChat.vue";
import FormChatGame from "@src/components/Forms/FormChatGame/FormChatGame.vue";

import { useUserStore } from "@src/stores/useUserStore";
import { useRoomStore } from "@src/stores/useRoomStore";

import socket from "@src/socket";

import assets from "@src/assets/export";


const roomStore = useRoomStore();
const userStore = useUserStore();

const messages = ref<Message[]>([]);

onMounted(() => {
  socket.on(EVENTS_SOCKET_SERVER.SEND_MESSAGE_GAME, (message: Message) => {
    if (!message.success) {
      return messages.value.push(message);
    }

    if (message.success && userStore.id === message.user.id) {
      const audio = new Audio(assets.audios.SuccessMp3);
      audio.play();
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
    <message-chat v-for="msg in messages" :key="msg.id" :username="msg.user.username" :message="msg.message"
      :class-username="msg.user.id === userStore.id ? 'text-primary font-bold' : 'text-white'
        "></message-chat>
  </div>
  <form-chat-game></form-chat-game>
</template>
