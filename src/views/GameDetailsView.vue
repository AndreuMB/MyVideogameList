<script setup async lang="ts">
import { onMounted, ref, type Ref } from 'vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { useRoute } from 'vue-router'
import type { Game } from '@/interfaces/GiantbombResponse'
import { getGameById } from '@/utils/utils'

const isLoading = ref(true)
const route = useRoute()
const game: Ref<Game | null> = ref(null)

onMounted(async () => {
  isLoading.value = true
  const gameId = Number.parseInt(route.params.gameId.toString())
  game.value = await getGameById(gameId, '')
  console.log(game.value)

  isLoading.value = false
})
</script>

<template>
  <LoadingSpinner v-if="isLoading || game == null" />
  <div v-else>
    <div class="mb-10">
      <h1 class="text-4xl">{{ game.name }}</h1>
      <p class="text-2xl">{{ game.date_added.split(' ')[0] }}</p>
    </div>
    <div class="flex gap-10">
      <div class="max-w-1/4">
        <img class="" :src="game.image.medium_url" alt="gameImg" />
      </div>
      <div class="w-3/4">
        <p
          v-if="game.description"
          class="description"
          v-html="game.description.replace('<h2>Overview</h2>', '')"
        ></p>
        <h2 v-else class="text-2xl text-terciary">NO DESCRIPTION AVAILABLE :(</h2>
        <h2 class="text-2xl mt-5">PLATFORMS</h2>
        <p v-for="platform in game.platforms" :key="platform.id">
          {{ platform.name }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.description a {
  display: none;
}
</style>
