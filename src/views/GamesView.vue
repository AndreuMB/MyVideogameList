<script setup lang="ts">
import GameCard from '@/components/GameCard.vue'
import InfiniteScroll from '@/components/InfiniteScroll.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import type { UserGameDb } from '@/interfaces/UserGameDb'
import type { Game } from '@/interfaces/GiantbombResponse'
import { getGamesDb, getGamesOrderByRelease, searchGamesByName } from '@/utils/utils'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { onMounted, ref, watch, type Ref } from 'vue'
import { useRoute } from 'vue-router'

const games: Ref<Game[] | undefined> = ref([])
const route = useRoute()
const isLoading: Ref<boolean> = ref(false)
const loadingScroll: Ref<boolean> = ref(false)
const gamesDb: Ref<UserGameDb[] | null> = ref(null)
const results = 12
let page = 0

const auth = getAuth()
const isLoggedIn = ref(false)
onAuthStateChanged(auth, async (user) => {
  if (user) {
    isLoggedIn.value = true
    gamesDb.value = await getGamesDb()
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
  isLoading.value = true
  games.value = []

  if (route.params.gameName) {
    games.value = await searchGamesByName(route.params.gameName.toString())
  } else {
    games.value = await getGamesOrderByRelease(
      results.toString(),
      (page * (results + 1)).toString(),
    )
  }
  isLoading.value = false
}

const loadMoreGames = async () => {
  if (!games.value || loadingScroll.value) return
  loadingScroll.value = true
  page++
  const newGames = await getGamesOrderByRelease(
    results.toString(),
    (page * (results + 1)).toString(),
  )
  if (newGames) {
    games.value = games.value.concat(newGames)
    loadingScroll.value = false
  }
}
</script>

<template>
  <h1 class="text-4xl mb-10">GAMES</h1>
  <InfiniteScroll v-if="games" @scroll-end="loadMoreGames">
    <LoadingSpinner v-if="isLoading" />
    <GameCard
      v-for="game in games"
      :gamesDb="gamesDb"
      :game="game"
      :is-logged-in="isLoggedIn"
      :key="game.id"
    />
    <LoadingSpinner v-if="loadingScroll" />
  </InfiniteScroll>
  <div v-if="(!games || games.length <= 0) && !isLoading" class="flex items-center text-6xl">
    <img src="/src/assets/book.png" alt="book" />
    <h2>NO GAMES AVAILABLES, DONT ASK</h2>
  </div>
</template>

<style scoped></style>
