<script setup lang="ts">
import { onMounted, ref } from "vue";

import {
  CountdownRoom,
  OptionsRoom,
  RoundsRoom,
  SlotsRoom,
  TypeRoom,
} from "@src/entities/entities.d";
import { EVENTS_SOCKET_CLIENT } from "@src/entities/enums";

import ButtonSecondary from "@src/components/Buttons/ButtonSecondary/ButtonSecondary.vue";
import InputSecondary from "@src/components/Inputs/InputSecondary/InputSecondary.vue";

import socket from "@src/socket";
import { useUserStore } from "@src/stores/user/user";
import { useAlertStore } from "@src/stores/alert/alert";

type FormCreateRoom = {
  name: string;
  type: TypeRoom;
  password: string;
  slots: SlotsRoom;
  totalRounds: RoundsRoom;
  countdown: CountdownRoom;
};

const INITIAL_VALUE_FORM: FormCreateRoom = {
  name: "",
  type: "public",
  password: "",
  slots: 6,
  totalRounds: 1,
  countdown: 10,
};

const form = ref<FormCreateRoom>({ ...INITIAL_VALUE_FORM });

const alertStore = useAlertStore();
const userStore = useUserStore();

const handleCreateRoom = (e: Event) => {
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
      message:
        "Enter a valid room name, if you are creating a private room, it needs a password.",
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

  socket.emit(EVENTS_SOCKET_CLIENT.CREATE_ROOM, optionsRoom);
};

onMounted(() => {
  form.value = { ...form.value, name: `Room of ${userStore.username}` };
});

// TODO: HACER OCMPONENTE SELEECT
</script>

<template>
  <form
    class="flex flex-col items-center justify-between w-full h-full"
    @submit="handleCreateRoom"
  >
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
        class="w-full h-12 text-lg bg-secondary border-secondary border-[0.2rem] px-2 mt-2 rounded-lg outline-none text-white cursor-pointer transition-all focus:border-quaternary"
        v-model="form.type"
      >
        <option value="public">Public room</option>
        <option value="private">Private room</option>
      </select>

      <InputSecondary
        id="password"
        type="password"
        placeholder="Insert a password for your room..."
        v-model="form.password"
        class="h-12 mt-2"
        v-if="form.type === 'private'"
      ></InputSecondary>

      <select
        id="slotsRoom"
        class="w-full h-12 text-lg bg-secondary border-secondary border-[0.2rem] px-2 mt-2 rounded-lg outline-none text-white cursor-pointer transition-all focus:border-quaternary"
        v-model="form.slots"
      >
        <option :value="6">6 Slots</option>
        <option :value="8">8 Slots</option>
      </select>

      <select
        id="totalRoundsRoom"
        class="w-full h-12 text-lg bg-secondary border-secondary border-[0.2rem] px-2 mt-2 rounded-lg outline-none text-white cursor-pointer transition-all focus:border-quaternary"
        v-model="form.totalRounds"
      >
        <option :value="1">1 Round</option>
        <option :value="2">2 Rounds</option>
        <option :value="3">3 Rounds</option>
      </select>

      <select
        id="countdown"
        class="w-full h-12 text-lg bg-secondary border-secondary border-[0.2rem] px-2 mt-2 rounded-lg outline-none text-white cursor-pointer transition-all focus:border-quaternary"
        v-model="form.countdown"
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

    <ButtonSecondary class="flex-2 p-2" type="submit">
      ¡Create room!
    </ButtonSecondary>
  </form>
</template>
