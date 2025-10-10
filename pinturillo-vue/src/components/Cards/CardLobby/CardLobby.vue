<script setup lang="ts">
import { ref, watchEffect } from "vue";
import { useRouter } from "vue-router";

import { User } from "@src/entities/entities";
import { EVENTS_SOCKET_CLIENT } from "@src/entities/enums";

import socket from "@src/socket";

const slots = ref<Record<string, number[]>>({});
const router = useRouter();

// TODO: PASARLE DIRECTAMENTE LA ROOM COMPLETA EN PROPS.
const props = defineProps<{
  idRoom: string;
  totalSlots: number;
  usersInRoom: number;
  ownerRoom: User;
  nameRoom: string;
  typeRoom: string;
}>();

const handleJoinRoom = (): void => {
  if (props.typeRoom === "Public Room") {
    router.push(`/room/lobby/${props.idRoom}`);
    return;
  }

  socket.emit(EVENTS_SOCKET_CLIENT.LEAVE_LOBBY);
  router.push(`/room/login/private?idRoom=${props.idRoom}`);
};

watchEffect(() => {
  slots.value.availableSlots = [
    ...Array(props.totalSlots - props.usersInRoom).keys(),
  ];
  slots.value.outSlots = [...Array(props.usersInRoom).keys()];
});
</script>

<template>
  <div
    class="flex flex-col w-full border-solid border-primary border-[.2rem] rounded-lg p-2 bg-primary bg-opacity-50 cursor-pointer transition-all hover:border-quaternary"
    @click="handleJoinRoom"
  >
    <div class="flex flex-col">
      <h3 class="text-white font-semibold text-sm">
        Owner: {{ props.ownerRoom.username }}
      </h3>
      <h3 class="text-white font-semibold text-sm">
        Name: {{ props.nameRoom }}
      </h3>
      <h3 class="text-white font-semibold text-sm">
        Type: {{ props.typeRoom }}
      </h3>
      <h3 class="text-white font-semibold text-sm">
        Slots: ({{ props.usersInRoom }}/{{ props.totalSlots }})
      </h3>
    </div>

    <div class="flex flex-row mt-2 self-end">
      <div
        v-for="(outSlot, index) in slots.outSlots"
        :class="[
          'w-4 h-4 bg-tertiary rounded-lg outSlot',
          index !== 0 ? 'ml-2' : '',
        ]"
        :key="`${outSlot}-${index}`"
      ></div>
      <div
        v-for="(availableSlot, index) in slots.availableSlots"
        :class="[
          'w-4 h-4 bg-quaternary rounded-lg availableSlot',
          slots.outSlots.length !== 0 ? 'ml-2' : index !== 0 ? 'ml-2' : '',
        ]"
        :key="`${availableSlot}-${index}`"
      ></div>
    </div>
  </div>
</template>
