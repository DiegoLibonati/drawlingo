<script setup lang="ts">
import { ref } from "vue";

import type { FormChatGame } from "@/types/forms";
import { EVENTS_SOCKET_CLIENT } from "@/types/enums";

import ButtonSecondary from "@/components/Buttons/ButtonSecondary/ButtonSecondary.vue";
import InputSecondary from "@/components/Inputs/InputSecondary/InputSecondary.vue";

import { useRoomStore } from "@/stores/useRoomStore";

import socket from "@/socket";

const INITIAL_VALUE_FORM: FormChatGame = {
  message: "",
};

const roomStore = useRoomStore();

const form = ref<FormChatGame>({ ...INITIAL_VALUE_FORM });

const handleSubmitForm = (e: Event): void => {
  e.preventDefault();

  const msg = form.value.message.trim();

  if (!msg) {
    form.value = { ...INITIAL_VALUE_FORM };
    return;
  }

  socket.emit(EVENTS_SOCKET_CLIENT.SEND_MESSAGE_GAME, {
    idRoom: roomStore.id,
    message: msg,
  });

  form.value = { ...INITIAL_VALUE_FORM };
};
</script>

<template>
  <form class="flex flex-row items-center justify-center h-[15%] w-full" @submit="handleSubmitForm">
    <InputSecondary
      id="message"
      v-model="form.message"
      placeholder="Enter a message.."
      type="text"
      class="flex-2 h-full px-2"
    ></InputSecondary>
    <ButtonSecondary class="flex-2 ml-2 h-full" type="submit"> Send </ButtonSecondary>
  </form>
</template>
