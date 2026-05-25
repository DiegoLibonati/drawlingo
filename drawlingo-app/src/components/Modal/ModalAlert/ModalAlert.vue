<script setup lang="ts">
import { useAlertStore } from "@/stores/useAlertStore";

const alertStore = useAlertStore();

const handleClearModal = (): void => {
  alertStore.clearAlert();
};
</script>

<template>
  <div
    class="flex flex-col items-center justify-center absolute z-20 bg-black bg-opacity-50 w-full h-full"
  >
    <div class="flex flex-col items-center justify-center bg-white p-4 w-96 rounded-lg shadow-md">
      <div class="flex flex-row w-full items-center justify-between bg-violet-600 p-4 rounded-lg">
        <v-icon v-if="alertStore.type === 'info'" name="fa-info" class="fill-white"></v-icon>

        <v-icon v-if="alertStore.type === 'error'" name="fa-bug" class="fill-white"></v-icon>

        <v-icon
          v-if="alertStore.type === 'warning'"
          name="fa-triangle-exclamation"
          class="fill-white"
        ></v-icon>

        <h2 class="font-semibold text-2xl ml-2 text-white tracking-wide">
          {{ alertStore.description }}
        </h2>
      </div>

      <h2 class="font-semibold text-xl my-2 text-justify tracking-wide px-4">
        {{ alertStore.message }}
      </h2>

      <button
        class="bg-violet-500 rounded-lg p-4 self-end text-white font-semibold cursor-pointer active:scale-90 hover:bg-opacity-75"
        type="button"
        @click="handleClearModal"
      >
        Close
      </button>
    </div>
  </div>
</template>
