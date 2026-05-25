<script setup lang="ts">
import ArticleGamePlayers from "@/components/Articles/ArticleGamePlayers/ArticleGamePlayers.vue";
import ArticleGameCanvas from "@/components/Articles/ArticleGameCanvas/ArticleGameCanvas.vue";
import ArticleGameChat from "@/components/Articles/ArticleGameChat/ArticleGameChat.vue";
import ArticleGameInformation from "@/components/Articles/ArticleGameInformation/ArticleGameInformation.vue";
</script>

<template>
  <section class="hidden grid-rows-6 grid-cols-6 gap-2 w-[90%] h-[90%] lg:grid">
    <ArticleGamePlayers></ArticleGamePlayers>
    <ArticleGameCanvas></ArticleGameCanvas>
    <ArticleGameChat></ArticleGameChat>
    <ArticleGameInformation></ArticleGameInformation>
  </section>
</template>
