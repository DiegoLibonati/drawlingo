<script setup lang="ts">
import { ref } from "vue";

import { EVENTS_SOCKET_CLIENT } from "@src/entities/enums";

import ButtonPrimary from "@src/components/Buttons/ButtonPrimary/ButtonPrimary.vue";
import InputTransparent from "@src/components/Inputs/InputTransparent/InputTransparent.vue";

import socket from "@src/socket";

type FormChatLobby = {
  message: string;
};

const INITIAL_VALUE_FORM: FormChatLobby = {
  message: "",
};

const form = ref<FormChatLobby>({ ...INITIAL_VALUE_FORM });

const handleSubmitForm = (e: Event) => {
  e.preventDefault();

  const msg = form.value.message.trim();

  if (!msg) {
    form.value = { ...INITIAL_VALUE_FORM };
    return;
  }

  // TODO: EVENT SEND MESSAGE
  socket.emit(EVENTS_SOCKET_CLIENT.SEND_MESSAGE_LOBBY, msg);

  form.value = { ...INITIAL_VALUE_FORM };
  return;
};
</script>

<template>
  <form
    class="flex flex-row items-center justify-center h-[15%] w-full"
    @submit="handleSubmitForm"
  >
    <InputTransparent
      id="message"
      placeholder="Enter a message.."
      class="flex-1 h-full px-2"
      v-model="form.message"
    ></InputTransparent>
    <ButtonPrimary class="flex-2 ml-2 h-full" type="submit">
      Send
    </ButtonPrimary>
  </form>
</template>
