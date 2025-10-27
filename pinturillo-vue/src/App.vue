<script setup lang="ts">
import HeaderComponent from "@src/components/Header/Header.vue";
import ModalAlert from "@src/components/Modal/ModalAlert/ModalAlert.vue";

import { useAlertStore } from "@src/stores/useAlertStore";

// NOTE: Si algo rompe saque de aca socket.off()

const alertStore = useAlertStore();
</script>

<template>
  <modal-alert v-if="alertStore.isOpen"></modal-alert>
  <header-component></header-component>
  <router-view></router-view>
</template>
