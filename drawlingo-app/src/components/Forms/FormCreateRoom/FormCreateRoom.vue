<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

import type { OptionsRoom, TypeRoom } from "@/types/app";
import type { FormCreateRoom } from "@/types/forms";
import type { AckResponse } from "@/types/responses";
import { EVENTS_SOCKET_CLIENT } from "@/types/enums";

import ButtonSecondary from "@/components/Buttons/ButtonSecondary/ButtonSecondary.vue";
import InputSecondary from "@/components/Inputs/InputSecondary/InputSecondary.vue";

import { useUserStore } from "@/stores/useUserStore";
import { useAlertStore } from "@/stores/useAlertStore";

import socket from "@/socket";

const INITIAL_VALUE_FORM: FormCreateRoom = {
  name: "",
  type: "public",
  password: "",
  slots: 6,
  totalRounds: 1,
  countdown: 10,
};

const form = ref<FormCreateRoom>({ ...INITIAL_VALUE_FORM });

const router = useRouter();
const alertStore = useAlertStore();
const userStore = useUserStore();

const handleCreateRoom = (e: Event): void => {
  e.preventDefault();

  const name = form.value.name.trim();
  const type = form.value.type.trim() as TypeRoom;
  const password = form.value.password.trim();
  const slots = form.value.slots;
  const totalRounds = form.value.totalRounds;
  const countdown = form.value.countdown;

  if (!name || (type === "private" && !password)) {
    form.value = { ...INITIAL_VALUE_FORM };
    alertStore.setAlert({
      type: "warning",
      message: "Enter a valid room name, if you are creating a private room, it needs a password.",
    });
    return;
  }

  const optionsRoom: OptionsRoom = {
    name: name,
    type: type,
    password: password && type === "private" ? password : "",
    slots: slots,
    totalRounds: totalRounds,
    countdown: countdown,
  };

  socket.emit(
    EVENTS_SOCKET_CLIENT.CREATE_ROOM,
    optionsRoom,
    (response: AckResponse<{ idRoom: string }>) => {
      if (!response.ok) {
        alertStore.setAlert({ type: "error", message: response.message });
        return;
      }

      void router.push(`/room/lobby/${response.data.idRoom}`);
    }
  );
};

onMounted(() => {
  form.value = { ...form.value, name: `Room of ${userStore.username}` };
});
</script>

<template>
  <form class="flex flex-col items-center justify-between w-full h-full" @submit="handleCreateRoom">
    <div class="flex-1 w-full">
      <InputSecondary
        id="name"
        v-model="form.name"
        placeholder="Insert a name for your room..."
        class="h-12"
        type="text"
      ></InputSecondary>

      <select
        id="typeRoom"
        v-model="form.type"
        class="w-full h-12 text-lg bg-secondary border-secondary border-[0.2rem] px-2 mt-2 rounded-lg outline-none text-white cursor-pointer transition-all focus:border-quaternary"
      >
        <option value="public">Public room</option>
        <option value="private">Private room</option>
      </select>

      <InputSecondary
        v-if="form.type === 'private'"
        id="password"
        v-model="form.password"
        type="password"
        placeholder="Insert a password for your room..."
        class="h-12 mt-2"
      ></InputSecondary>

      <select
        id="slotsRoom"
        v-model="form.slots"
        class="w-full h-12 text-lg bg-secondary border-secondary border-[0.2rem] px-2 mt-2 rounded-lg outline-none text-white cursor-pointer transition-all focus:border-quaternary"
      >
        <option :value="6">6 Slots</option>
        <option :value="8">8 Slots</option>
      </select>

      <select
        id="totalRoundsRoom"
        v-model="form.totalRounds"
        class="w-full h-12 text-lg bg-secondary border-secondary border-[0.2rem] px-2 mt-2 rounded-lg outline-none text-white cursor-pointer transition-all focus:border-quaternary"
      >
        <option :value="1">1 Round</option>
        <option :value="2">2 Rounds</option>
        <option :value="3">3 Rounds</option>
      </select>

      <select
        id="countdown"
        v-model="form.countdown"
        class="w-full h-12 text-lg bg-secondary border-secondary border-[0.2rem] px-2 mt-2 rounded-lg outline-none text-white cursor-pointer transition-all focus:border-quaternary"
      >
        <option :value="10">10 Seconds</option>
        <option :value="20">20 Seconds</option>
        <option :value="30">30 Seconds</option>
        <option :value="40">40 Seconds</option>
        <option :value="50">50 Seconds</option>
        <option :value="60">60 Seconds</option>
        <option :value="70">70 Seconds</option>
        <option :value="80">80 Seconds</option>
        <option :value="90">90 Seconds</option>
      </select>
    </div>

    <ButtonSecondary class="flex-2 p-2" type="submit"> ¡Create room! </ButtonSecondary>
  </form>
</template>
