<script setup lang="ts">
import ArticleGamePlayers from "@src/components/Articles/ArticleGamePlayers/ArticleGamePlayers.vue";
import ArticleGameCanvas from "@src/components/Articles/ArticleGameCanvas/ArticleGameCanvas.vue";
import ArticleGameChat from "@src/components/Articles/ArticleGameChat/ArticleGameChat.vue";
import ArticleGameInformation from "@src/components/Articles/ArticleGameInformation/ArticleGameInformation.vue";
</script>

<template>
  <section class="hidden grid-rows-6 grid-cols-6 gap-2 w-[90%] h-[90%] lg:grid">
    <article-game-players></article-game-players>
    <article-game-canvas></article-game-canvas>
    <article-game-chat></article-game-chat>
    <article-game-information></article-game-information>
  </section>
</template>
