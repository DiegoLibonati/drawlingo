<script setup lang="ts">
import { useRouter } from "vue-router";

import ButtonSecondary from "@src/components/Buttons/ButtonSecondary/ButtonSecondary.vue";
import ArticleListPlayersScore from "@src/components/Articles/ArticleListPlayersScore/ArticleListPlayersScore.vue";

import socket from "@src/socket";

const router = useRouter();

const handleRedirectToHome = (): void => {
  socket.disconnect();
  router.push("/");
};
</script>

<template>
  <section
    class="hidden flex-col items-center justify-start w-[30rem] h-[30rem] bg-primary rounded-lg p-2 shadow-md lg:flex">
    <h2 class="flex-2 first-line:text-xl text-white font-semibold p-2 w-full rounded-lg bg-secondary">
      Final Standings
    </h2>

    <article-list-players-score></article-list-players-score>

    <button-secondary class="flex-2 p-2 mt-2" :click="handleRedirectToHome" type="button">Exit</button-secondary>
  </section>
</template>
