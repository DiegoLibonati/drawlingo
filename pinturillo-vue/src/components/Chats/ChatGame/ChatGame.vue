<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from "vue";

import { Message } from "@/entities/entities";
import { EVENTS_SOCKET_SERVER } from "@/entities/enums";

import MessageChat from "@/components/Chats/MessageChat/MessageChat.vue";
import FormChatGame from "@/components/Forms/FormChatGame/FormChatGame.vue";

import socket from "@/socket";
import { useUserStore } from "@/stores/user/user";
import { useRoomStore } from "@/stores/room/room";

import successMp3 from "@/assets/audios/success.mp3";

const roomStore = useRoomStore();
const userStore = useUserStore();

const messages = ref<Message[]>([]);

onMounted(() => {
  socket.on(EVENTS_SOCKET_SERVER.SEND_MESSAGE_GAME, (message: Message) => {
    if (!message.success) {
      return messages.value.push(message);
    }

    if (message.success && userStore.id === message.user.id) {
      const audio = new Audio(successMp3);
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
    <MessageChat
      v-for="msg in messages"
      :key="msg.id"
      :username="msg.user.username"
      :message="msg.message"
      :class-username="
        msg.user.id === userStore.id ? 'text-primary font-bold' : 'text-white'
      "
    ></MessageChat>
  </div>
  <FormChatGame></FormChatGame>
</template>
