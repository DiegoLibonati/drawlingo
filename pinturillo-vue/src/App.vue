<script setup lang="ts">
import Header from "@/components/Header/Header.vue";
import ModalAlert from "@/components/Modal/ModalAlert/ModalAlert.vue";

import { useAlertStore } from "@/stores/alert/alert";

// NOTE: Si algo rompe saque de aca socket.off()

const alertStore = useAlertStore();
</script>

<template>
  <ModalAlert v-if="alertStore.isOpen"></ModalAlert>
  <Header></Header>
  <RouterView></RouterView>
</template>
