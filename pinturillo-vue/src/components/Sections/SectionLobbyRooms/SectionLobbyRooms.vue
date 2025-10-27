<script setup lang="ts">
import { useRouter } from "vue-router";

import { EVENTS_SOCKET_CLIENT } from "@src/entities/enums";

import ButtonPrimary from "@src/components/Buttons/ButtonPrimary/ButtonPrimary.vue";
import CardLobby from "@src/components/Cards/CardLobby/CardLobby.vue";

import { useLobbyStore } from "@src/stores/useLobbyStore";

import socket from "@src/socket";

const lobbyStore = useLobbyStore();

const router = useRouter();

const handleCreateRoom = () => {
  socket.emit(EVENTS_SOCKET_CLIENT.LEAVE_LOBBY);
  router.push("/room/create");
};
</script>

<template>
  <section
    class="hidden flex-col w-[40rem] h-[30rem] mr-4 border-solid border-primary border-[.2rem] rounded-lg p-2 bg-tertiary overflow-auto shadow-md lg:flex">
    <article class="flex flex-row items-center justify-between w-full rounded-tl-lg rounded-tr-lg bg-primary p-2">
      <h2 class="text-white font-semibold">
        Rooms: {{ lobbyStore.roomsLength }}
      </h2>
      <h2 class="text-white font-semibold ml-2">
        Lobby Users: {{ lobbyStore.usersOnInLobby }}
      </h2>
      <h2 class="text-white font-semibold ml-2">
        All Players: {{ lobbyStore.appTotalPlayers }}
      </h2>
    </article>

    <button-primary v-if="lobbyStore.roomsLength === 0" class="h-16 mt-2" type="button" :click="handleCreateRoom">
      ¡Create a room!
    </button-primary>

    <article class="grid grid-cols-2 gap-2 mt-2">
      <card-lobby v-for="room in lobbyStore.rooms" :idRoom="room.id" :totalSlots="room.configuration.slots"
        :usersInRoom="room.players.length" :ownerRoom="room.owner" :nameRoom="room.configuration.name" :typeRoom="room.configuration.type === 'private' ? 'Private Room' : 'Public Room'
          "></card-lobby>
    </article>
  </section>
</template>
