<script setup lang="ts">
import GameCard from '@/components/GameCard.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import type { Game } from '@/interfaces/GiantbombResponse'
import { getGamesOrderByRelease, searchGamesByName } from '@/utils/utils'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { onMounted, ref, watch, type Ref } from 'vue'
import { useRoute } from 'vue-router'

const games: Ref<Game[]> = ref([])
const route = useRoute()
const loading: Ref<boolean> = ref(false)

const auth = getAuth()
const isLoggedIn = ref(false)
onAuthStateChanged(auth, (user) => {
  if (user) {
    isLoggedIn.value = true
  } else {
    isLoggedIn.value = false
  }
})

onMounted(async () => {
  searchGames()
})

watch(route, async () => {
  searchGames()
})

const searchGames = async () => {
  loading.value = true
  games.value = []

  if (route.params.gameName) {
    games.value = await searchGamesByName(route.params.gameName.toString())
  } else {
    games.value = await getGamesOrderByRelease()
  }
  loading.value = false
}
</script>

<template>
  <h1 class="text-4xl mb-10">GAMES</h1>
  <div
    class="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 xl:gap-x-8"
  >
    <LoadingSpinner v-if="loading" />
    <GameCard :game="game" :is-logged-in="isLoggedIn" v-for="game in games" :key="game.id" />
  </div>
</template>

<style scoped></style>
