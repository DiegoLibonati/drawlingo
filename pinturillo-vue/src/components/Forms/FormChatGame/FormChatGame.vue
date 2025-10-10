<script setup lang="ts">
import { ref } from "vue";

import { EVENTS_SOCKET_CLIENT } from "@src/entities/enums";

import ButtonSecondary from "@src/components/Buttons/ButtonSecondary/ButtonSecondary.vue";
import InputSecondary from "@src/components/Inputs/InputSecondary/InputSecondary.vue";

import socket from "@src/socket";
import { useRoomStore } from "@src/stores/room/room";

type FormChatGame = {
  message: string;
};

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
  <form
    class="flex flex-row items-center justify-center h-[15%] w-full"
    @submit="handleSubmitForm"
  >
    <InputSecondary
      id="message"
      placeholder="Enter a message.."
      type="text"
      class="flex-2 h-full px-2"
      v-model="form.message"
    ></InputSecondary>
    <ButtonSecondary class="flex-2 ml-2 h-full" type="submit">
      Send
    </ButtonSecondary>
  </form>
</template>
