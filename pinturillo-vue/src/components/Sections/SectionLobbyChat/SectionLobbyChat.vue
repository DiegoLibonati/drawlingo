<script setup lang="ts">
import ChatLobby from "@src/components/Chats/ChatLobby/ChatLobby.vue";
</script>

<template>
  <section
    class="hidden flex-col justify-between w-[20rem] h-[30rem] mt-0 border-solid border-primary border-[.2rem] rounded-lg p-2 bg-tertiary shadow-md lg:flex"
  >
    <chat-lobby></chat-lobby>
  </section>
</template>
