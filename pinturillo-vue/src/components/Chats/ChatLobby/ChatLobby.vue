<script setup lang="ts">
import { onMounted, ref, onBeforeUnmount } from "vue";

import { Message } from "@/entities/entities";
import { EVENTS_SOCKET_SERVER } from "@/entities/enums";

import MessageChat from "@/components/Chats/MessageChat/MessageChat.vue";
import FormChatLobby from "@/components/Forms/FormChatLobby/FormChatLobby.vue";

import socket from "@/socket";
import { useUserStore } from "@/stores/user/user";

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
    <MessageChat
      v-for="msg in messages"
      :key="msg.id"
      :username="msg.user.username"
      :message="msg.message"
      :class-username="
        msg.user.id === userStore.id ? 'text-primary font-bold' : 'text-white'
      "
    ></MessageChat>
  </article>
  <FormChatLobby></FormChatLobby>
</template>
