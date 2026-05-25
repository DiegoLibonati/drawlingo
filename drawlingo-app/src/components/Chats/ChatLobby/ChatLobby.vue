<script setup lang="ts">
import { onMounted, ref, onBeforeUnmount } from "vue";

import type { Message } from "@/types/app";
import { EVENTS_SOCKET_SERVER } from "@/types/enums";

import MessageChat from "@/components/Chats/MessageChat/MessageChat.vue";
import FormChatLobby from "@/components/Forms/FormChatLobby/FormChatLobby.vue";

import { useUserStore } from "@/stores/useUserStore";

import socket from "@/socket";

const userStore = useUserStore();

const messages = ref<Message[]>([]);

onMounted(() =>
  socket.on(EVENTS_SOCKET_SERVER.SEND_MESSAGE_LOBBY, (message: Message) => {
    messages.value.push(message);
  })
);

onBeforeUnmount(() => {
  socket.off(EVENTS_SOCKET_SERVER.SEND_MESSAGE_LOBBY);
});
</script>

<template>
  <article class="h-[85%] w-full overflow-auto">
    <MessageChat
      v-for="msg in messages"
      :key="msg.id"
      :username="msg.user.username"
      :message="msg.message"
      :classUsername="msg.user.id === userStore.id ? 'text-primary font-bold' : 'text-white'"
    ></MessageChat>
  </article>
  <FormChatLobby></FormChatLobby>
</template>
