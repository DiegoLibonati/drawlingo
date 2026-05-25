<script setup lang="ts">
import { ref, watchEffect } from "vue";
import { useRouter } from "vue-router";

import { EVENTS_SOCKET_CLIENT } from "@/types/enums";
import type { CardLobbyProps } from "@/types/props";

import socket from "@/socket";

const props = defineProps<CardLobbyProps>();
const slots = ref<{ availableSlots: number[]; outSlots: number[] }>({
  availableSlots: [],
  outSlots: [],
});
const router = useRouter();

const handleJoinRoom = (): void => {
  if (props.typeRoom === "Public Room") {
    void router.push(`/room/lobby/${props.idRoom}`);
    return;
  }

  socket.emit(EVENTS_SOCKET_CLIENT.LEAVE_LOBBY);
  void router.push(`/room/login/private?idRoom=${props.idRoom}`);
};

watchEffect(() => {
  slots.value.availableSlots = [...Array(props.totalSlots - props.usersInRoom).keys()];
  slots.value.outSlots = [...Array(props.usersInRoom).keys()];
});
</script>

<template>
  <div
    class="flex flex-col w-full border-solid border-primary border-[.2rem] rounded-lg p-2 bg-primary bg-opacity-50 cursor-pointer transition-all hover:border-quaternary"
    @click="handleJoinRoom"
  >
    <div class="flex flex-col">
      <h3 class="text-white font-semibold text-sm">Owner: {{ props.ownerRoom.username }}</h3>
      <h3 class="text-white font-semibold text-sm">Name: {{ props.nameRoom }}</h3>
      <h3 class="text-white font-semibold text-sm">Type: {{ props.typeRoom }}</h3>
      <h3 class="text-white font-semibold text-sm">
        Slots: ({{ props.usersInRoom }}/{{ props.totalSlots }})
      </h3>
    </div>

    <div class="flex flex-row mt-2 self-end">
      <div
        v-for="(outSlot, index) in slots.outSlots"
        :key="`${outSlot}-${index}`"
        :class="['w-4 h-4 bg-tertiary rounded-lg outSlot', index !== 0 ? 'ml-2' : '']"
      ></div>
      <div
        v-for="(availableSlot, index) in slots.availableSlots"
        :key="`${availableSlot}-${index}`"
        :class="[
          'w-4 h-4 bg-quaternary rounded-lg availableSlot',
          slots.outSlots.length !== 0 ? 'ml-2' : index !== 0 ? 'ml-2' : '',
        ]"
      ></div>
    </div>
  </div>
</template>
