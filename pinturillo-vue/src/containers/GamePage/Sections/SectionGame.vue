<script setup lang="ts">
import ArticleGamePlayers from "@/containers/GamePage/Articles/ArticleGamePlayers.vue";
import ArticleGameCanvas from "@/containers/GamePage/Articles/ArticleGameCanvas.vue";
import ArticleGameChat from "@/containers/GamePage/Articles/ArticleGameChat.vue";
import ArticleGameInformation from "@/containers/GamePage/Articles/ArticleGameInformation.vue";
</script>

<template>
  <section class="hidden grid-rows-6 grid-cols-6 gap-2 w-[90%] h-[90%] lg:grid">
    <ArticleGamePlayers></ArticleGamePlayers>
    <ArticleGameCanvas></ArticleGameCanvas>
    <ArticleGameChat></ArticleGameChat>
    <ArticleGameInformation></ArticleGameInformation>
  </section>
</template>
