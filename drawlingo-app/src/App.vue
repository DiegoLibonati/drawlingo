<script setup lang="ts">
import HeaderComponent from "@/components/Header/Header.vue";
import ModalAlert from "@/components/Modal/ModalAlert/ModalAlert.vue";

import { useAlertStore } from "@/stores/useAlertStore";

// NOTE: Si algo rompe saque de aca socket.off()

const alertStore = useAlertStore();
</script>

<template>
  <ModalAlert v-if="alertStore.isOpen"></ModalAlert>
  <HeaderComponent></HeaderComponent>
  <router-view></router-view>
</template>
