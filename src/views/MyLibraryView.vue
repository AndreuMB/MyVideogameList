<script setup async lang="ts">
import type { Game } from '@/interfaces/GiantbombResponse'
import { ref, type Ref } from 'vue'
import GameCard from '@/components/GameCard.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { getGamesDbDetailsv2, getGamesDbInLibrary } from '@/utils/utils'
import type { UserGameDb } from '@/interfaces/UserGameDb'
import InfiniteScroll from '@/components/InfiniteScroll.vue'
import ErrorMessage from '@/components/ErrorMessage.vue'
import openBook from '@/assets/book.png'

const games: Ref<Game[]> = ref([])

const auth = getAuth()
const isLoading = ref(true)
const gamesDb: Ref<UserGameDb[] | null> = ref(null)
const loadingScroll: Ref<boolean> = ref(false)
const results: number = 12
let gamesInLibrary: UserGameDb[] | null = null
let page = 1

onAuthStateChanged(auth, async (user) => {
  gamesInLibrary = await getGamesDbInLibrary()
  if (user) {
    loadGames()
  }
})

const loadGames = async () => {
  isLoading.value = true

  if (gamesInLibrary) {
    const showGamesInLibrary = gamesInLibrary.slice(0, results)
    gamesDb.value = showGamesInLibrary

    const gamesIdsInLibrary = showGamesInLibrary.map((game) => game.id)

    const gamesCheck = await getGamesDbDetailsv2(gamesIdsInLibrary)
    if (gamesCheck) games.value = gamesCheck
  }

  isLoading.value = false
}

let noMoreGames = false

const loadMoreGames = async () => {
  if (!games.value || !gamesDb.value || loadingScroll.value || noMoreGames || !gamesInLibrary)
    return

  loadingScroll.value = true

  const newGamesInLibrary = gamesInLibrary.slice(results * page, results * page + results)

  if (newGamesInLibrary && newGamesInLibrary.length > 0) {
    const gamesIdsInLibrary = newGamesInLibrary.map((game) => game.id)

    const newGames = await getGamesDbDetailsv2(gamesIdsInLibrary)
    if (newGames) games.value = games.value.concat(newGames)
    gamesDb.value = gamesDb.value.concat(newGamesInLibrary)
    page++
  } else {
    noMoreGames = true
  }
  loadingScroll.value = false
}
</script>

<template>
  <h1 class="text-4xl mb-10">MY LIBRARY</h1>
  <LoadingSpinner v-if="isLoading" />

  <InfiniteScroll v-else @scroll-end="loadMoreGames">
    <GameCard
      v-for="game in games"
      :game="game"
      :gamesDb="gamesDb"
      :is-logged-in="true"
      :key="game.id"
    />
    <LoadingSpinner v-if="loadingScroll" />
  </InfiniteScroll>

  <ErrorMessage
    v-if="games.length <= 0 && !isLoading"
    error_message="NO GAMES IN YOUR LIBRARY, ADD THEM"
    redirect_message="HERE"
    :image="openBook"
  />
</template>

<style scoped></style>
