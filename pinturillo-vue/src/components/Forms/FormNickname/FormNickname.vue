<script setup lang="ts">
import { ref } from "vue";

import { EVENTS_SOCKET_CLIENT } from "@src/entities/enums";
import { FormNickname } from "@src/entities/forms";

import ButtonGridTertiaryFull from "@src/components/Buttons/ButtonGridTertiaryFull/ButtonGridTertiaryFull.vue";
import ButtonGridTertiary from "@src/components/Buttons/ButtonGridTertiary/ButtonGridTertiary.vue";
import InputTransparent from "@src/components/Inputs/InputTransparent/InputTransparent.vue";

import { useAlertStore } from "@src/stores/useAlertStore";

import socket from "@src/socket";


const INITIAL_VALUE_FORM: FormNickname = {
  nickname: "player",
};

const alertStore = useAlertStore();

const form = ref<FormNickname>({ ...INITIAL_VALUE_FORM });

const handleRedirect = async (path: string): Promise<void> => {
  const nickname = form.value.nickname.trim();

  if (!nickname) {
    alertStore.setAlert({ type: "warning", message: "Enter a valid username" });
    form.value = { ...INITIAL_VALUE_FORM };
    return;
  }

  try {
    await new Promise<void>((resolve, reject) => {
      socket.once("connect", () => {
        resolve();
      });
      socket.once("connect_error", (error) => {
        reject(error);
      });
      socket.connect();
    });

    socket.emit(EVENTS_SOCKET_CLIENT.CONNECT, {
      username: nickname,
      pathToRedirect: path,
    });
  } catch (error) {
    console.error("Error al conectar el socket:", error);
    alertStore.setAlert({
      type: "error",
      message: "Could not connect to the server, try again",
    });
  }
};
</script>

<template>
  <form class="flex flex-col items-start justify-center h-auto w-full">
    <input-transparent :id="'nickname'" :label-value="'Nickname'" :placeholder="'Insert your nickname'"
      class="text-4xl p-2 mt-2" v-model="form.nickname"></input-transparent>
    <div class="grid grid-cols-2 gap-2 w-full mt-4">
      <button-grid-tertiary id="btn-lobby" :click="() => handleRedirect('/lobby')">
        LOBBY
      </button-grid-tertiary>
      <button-grid-tertiary id="btn-create-room" :click="() => handleRedirect('/room/create')">
        CREATE ROOM
      </button-grid-tertiary>
      <button-grid-tertiary-full id="btn-join-to-private-room" :click="() => handleRedirect('/room/login/private')">JOIN
        TO PRIVATE ROOM</button-grid-tertiary-full>
    </div>
  </form>
</template>
