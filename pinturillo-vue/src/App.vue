<script setup lang="ts">
import Header from "@src/components/Header/Header.vue";
import ModalAlert from "@src/components/Modal/ModalAlert/ModalAlert.vue";

import { useAlertStore } from "@src/stores/alert/alert";

// NOTE: Si algo rompe saque de aca socket.off()

const alertStore = useAlertStore();
</script>

<template>
  <ModalAlert v-if="alertStore.isOpen"></ModalAlert>
  <Header></Header>
  <RouterView></RouterView>
</template>
