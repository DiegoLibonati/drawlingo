<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

import { EVENTS_SOCKET_CLIENT } from "@src/entities/enums";

import ButtonSecondary from "@src/components/Buttons/ButtonSecondary/ButtonSecondary.vue";
import InputSecondary from "@src/components/Inputs/InputSecondary/InputSecondary.vue";

import socket from "@src/socket";
import { useAlertStore } from "@src/stores/alert/alert";

type FormLoginPrivate = {
  idRoom: string;
  password: string;
};

const INITIAL_VALUE_FORM: FormLoginPrivate = {
  idRoom: "",
  password: "",
};

const form = ref<FormLoginPrivate>({ ...INITIAL_VALUE_FORM });

const route = useRoute();

const alertStore = useAlertStore();

const handleSubmitForm = (e: Event) => {
  e.preventDefault();

  const idRoom = form.value.idRoom.trim();
  const password = form.value.password.trim();

  if (!idRoom || !password) {
    form.value = { ...INITIAL_VALUE_FORM };
    alertStore.setAlert({
      type: "warning",
      message: "You must enter an ID and password to enter a private room.",
    });
    return;
  }

  const formValues = {
    idRoom: idRoom,
    password: password,
  };

  socket.emit(EVENTS_SOCKET_CLIENT.LOGIN_PRIVATE_ROOM, formValues);

  form.value = { ...INITIAL_VALUE_FORM };
  return;
};

onMounted(() => {
  const searchParams = route.query;

  if (searchParams.idRoom) {
    form.value.idRoom = String(searchParams.idRoom);
  }
});
</script>

<template>
  <form
    class="flex flex-col justify-between w-full h-full mt-2"
    @submit="handleSubmitForm"
  >
    <div class="flex flex-1 flex-col items-center w-full">
      <InputSecondary
        id="idRoom"
        placeholder="Room ID"
        class="p-2"
        v-model="form.idRoom"
        type="text"
      ></InputSecondary>
      <InputSecondary
        id="password"
        type="password"
        placeholder="Password"
        class="p-2 mt-2"
        v-model="form.password"
      ></InputSecondary>
    </div>
    <ButtonSecondary class="flex-2 p-2 mt-8" type="submit">
      {{ form.idRoom ? `Connect to ${form.idRoom}` : "Connect" }}
    </ButtonSecondary>
  </form>
</template>
