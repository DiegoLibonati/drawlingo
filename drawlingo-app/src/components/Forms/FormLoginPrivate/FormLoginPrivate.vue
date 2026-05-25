<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import { EVENTS_SOCKET_CLIENT } from "@/types/enums";
import type { FormLoginPrivate } from "@/types/forms";
import type { AckResponse } from "@/types/responses";

import ButtonSecondary from "@/components/Buttons/ButtonSecondary/ButtonSecondary.vue";
import InputSecondary from "@/components/Inputs/InputSecondary/InputSecondary.vue";

import { useAlertStore } from "@/stores/useAlertStore";

import socket from "@/socket";

const INITIAL_VALUE_FORM: FormLoginPrivate = {
  idRoom: "",
  password: "",
};

const form = ref<FormLoginPrivate>({ ...INITIAL_VALUE_FORM });

const route = useRoute();
const router = useRouter();

const alertStore = useAlertStore();

const handleSubmitForm = (e: Event): void => {
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

  socket.emit(
    EVENTS_SOCKET_CLIENT.LOGIN_PRIVATE_ROOM,
    { idRoom, password },
    (response: AckResponse<{ idRoom: string }>) => {
      if (!response.ok) {
        alertStore.setAlert({ type: "error", message: response.message });
        return;
      }

      void router.push(`/room/lobby/${response.data.idRoom}`);
    }
  );

  form.value = { ...INITIAL_VALUE_FORM };
};

onMounted(() => {
  const searchParams = route.query;

  if (searchParams.idRoom) {
    form.value.idRoom = String(searchParams.idRoom);
  }
});
</script>

<template>
  <form class="flex flex-col justify-between w-full h-full mt-2" @submit="handleSubmitForm">
    <div class="flex flex-1 flex-col items-center w-full">
      <InputSecondary
        id="idRoom"
        v-model="form.idRoom"
        placeholder="Room ID"
        class="p-2"
        type="text"
      ></InputSecondary>
      <InputSecondary
        id="password"
        v-model="form.password"
        type="password"
        placeholder="Password"
        class="p-2 mt-2"
      ></InputSecondary>
    </div>
    <ButtonSecondary class="flex-2 p-2 mt-8" type="submit">
      {{ form.idRoom ? `Connect to ${form.idRoom}` : "Connect" }}
    </ButtonSecondary>
  </form>
</template>
