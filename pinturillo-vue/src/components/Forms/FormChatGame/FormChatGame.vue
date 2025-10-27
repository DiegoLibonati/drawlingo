<script setup lang="ts">
import { ref } from "vue";

import { FormChatGame } from "@src/entities/forms";
import { EVENTS_SOCKET_CLIENT } from "@src/entities/enums";

import ButtonSecondary from "@src/components/Buttons/ButtonSecondary/ButtonSecondary.vue";
import InputSecondary from "@src/components/Inputs/InputSecondary/InputSecondary.vue";

import { useRoomStore } from "@src/stores/useRoomStore";

import socket from "@src/socket";


const INITIAL_VALUE_FORM: FormChatGame = {
  message: "",
};

const roomStore = useRoomStore();

const form = ref<FormChatGame>({ ...INITIAL_VALUE_FORM });

const handleSubmitForm = (e: Event) => {
  e.preventDefault();

  const msg = form.value.message.trim();

  if (!msg) {
    form.value = { ...INITIAL_VALUE_FORM };
    return;
  }

  // TODO: EVENT SEND MESSAGE
  socket.emit(EVENTS_SOCKET_CLIENT.SEND_MESSAGE_GAME, {
    idRoom: roomStore.id,
    message: msg,
  });

  form.value = { ...INITIAL_VALUE_FORM };
  return;
};
</script>

<template>
  <form class="flex flex-row items-center justify-center h-[15%] w-full" @submit="handleSubmitForm">
    <input-secondary id="message" placeholder="Enter a message.." type="text" class="flex-2 h-full px-2"
      v-model="form.message"></input-secondary>
    <button-secondary class="flex-2 ml-2 h-full" type="submit">
      Send
    </button-secondary>
  </form>
</template>
