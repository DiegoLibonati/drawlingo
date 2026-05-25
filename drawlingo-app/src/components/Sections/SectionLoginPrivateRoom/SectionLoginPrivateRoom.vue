<script setup lang="ts">
import FormLoginPrivate from "@/components/Forms/FormLoginPrivate/FormLoginPrivate.vue";
</script>

<template>
  <section
    class="hidden flex-col items-center justify-between w-[30rem] h-[20rem] bg-primary rounded-lg p-2 shadow-md lg:flex"
  >
    <h2
      class="w-full text-center p-2 rounded-lg bg-secondary text-white uppercase font-semibold text-lg"
    >
      Connect to a private room
    </h2>
    <FormLoginPrivate></FormLoginPrivate>
  </section>
</template>
