<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

import { EVENTS_SOCKET_CLIENT } from "@/types/enums";
import type { FormNickname } from "@/types/forms";
import type { User } from "@/types/app";
import type { AckResponse } from "@/types/responses";

import ButtonGridTertiaryFull from "@/components/Buttons/ButtonGridTertiaryFull/ButtonGridTertiaryFull.vue";
import ButtonGridTertiary from "@/components/Buttons/ButtonGridTertiary/ButtonGridTertiary.vue";
import InputTransparent from "@/components/Inputs/InputTransparent/InputTransparent.vue";

import { useAlertStore } from "@/stores/useAlertStore";
import { useUserStore } from "@/stores/useUserStore";

import socket from "@/socket";

const INITIAL_VALUE_FORM: FormNickname = {
  nickname: "player",
};

const router = useRouter();
const alertStore = useAlertStore();
const userStore = useUserStore();

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

    socket.emit(
      EVENTS_SOCKET_CLIENT.CONNECT,
      { username: nickname, pathToRedirect: path },
      (response: AckResponse<{ user: User; pathToRedirect: string }>) => {
        if (!response.ok) {
          alertStore.setAlert({ type: "error", message: response.message });
          return;
        }

        userStore.login(response.data.user);
        void router.push(response.data.pathToRedirect);
      }
    );
  } catch {
    alertStore.setAlert({
      type: "error",
      message: "Could not connect to the server, try again",
    });
  }
};
</script>

<template>
  <form class="flex flex-col items-start justify-center h-auto w-full">
    <InputTransparent
      :id="'nickname'"
      v-model="form.nickname"
      :labelValue="'Nickname'"
      :placeholder="'Insert your nickname'"
      class="text-4xl p-2 mt-2"
    ></InputTransparent>
    <div class="grid grid-cols-2 gap-2 w-full mt-4">
      <ButtonGridTertiary id="btn-lobby" :click="() => handleRedirect('/lobby')">
        LOBBY
      </ButtonGridTertiary>
      <ButtonGridTertiary id="btn-create-room" :click="() => handleRedirect('/room/create')">
        CREATE ROOM
      </ButtonGridTertiary>
      <ButtonGridTertiaryFull
        id="btn-join-to-private-room"
        :click="() => handleRedirect('/room/login/private')"
        >JOIN TO PRIVATE ROOM</ButtonGridTertiaryFull
      >
    </div>
  </form>
</template>
