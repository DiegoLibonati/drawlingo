<script setup lang="ts">
import { onMounted, ref, onBeforeUnmount } from "vue";

import { Message } from "@src/entities/app";
import { EVENTS_SOCKET_SERVER } from "@src/entities/enums";

import MessageChat from "@src/components/Chats/MessageChat/MessageChat.vue";
import FormChatLobby from "@src/components/Forms/FormChatLobby/FormChatLobby.vue";

import { useUserStore } from "@src/stores/useUserStore";

import socket from "@src/socket";

const userStore = useUserStore();

const messages = ref<Message[]>([]);

onMounted(() =>
  socket.on(EVENTS_SOCKET_SERVER.SEND_MESSAGE_LOBBY, (message: Message) => {
    messages.value.push(message);
  })
);

onBeforeUnmount(() => {
  socket.off(EVENTS_SOCKET_SERVER.SEND_MESSAGE_LOBBY)
})
</script>

<template>
  <article class="h-[85%] w-full overflow-auto">
    <message-chat v-for="msg in messages" :key="msg.id" :username="msg.user.username" :message="msg.message"
      :class-username="msg.user.id === userStore.id ? 'text-primary font-bold' : 'text-white'
        "></message-chat>
  </article>
  <form-chat-lobby></form-chat-lobby>
</template>
