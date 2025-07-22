<script setup async lang="ts">
import type { Game } from '@/interfaces/GiantbombResponse'
import { ref, type Ref } from 'vue'
import GameCard from '@/components/GameCard.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { getGamesDb, getGamesDbDetails } from '@/utils/utils'
import type { UserGameDb } from '@/interfaces/UserGameDb'
import InfiniteScroll from '@/components/InfiniteScroll.vue'

const games: Ref<Game[]> = ref([])

const auth = getAuth()
const isLoading = ref(true)
const gamesDb: Ref<UserGameDb[] | null> = ref(null)
const loadingScroll: Ref<boolean> = ref(false)
const results: number = 12

onAuthStateChanged(auth, async (user) => {
  if (user) {
    loadGames()
  }
})

const loadGames = async () => {
  isLoading.value = true
  const gamesUser = await getGamesDb(results, 0)

  if (gamesUser) {
    const gamesInLibrary = gamesUser.filter((game) => game.isInLibrary)
    gamesDb.value = gamesInLibrary
    games.value = await getGamesDbDetails(gamesInLibrary)
  }

  isLoading.value = false
}

let noMoreGames = false

const loadMoreGames = async () => {
  if (!games.value || !gamesDb.value || loadingScroll.value || noMoreGames) return
  loadingScroll.value = true
  const newGamesUser = await getGamesDb(results, games.value[games.value.length - 1].id)
  if (newGamesUser) {
    const newGamesInLibrary = newGamesUser.filter((game) => game.isInLibrary)
    if (newGamesInLibrary) {
      gamesDb.value = gamesDb.value.concat(newGamesInLibrary)
      const newGames = await getGamesDbDetails(newGamesInLibrary)
      games.value = games.value.concat(newGames)
    }
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

  <!-- <div
    v-else
    class="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 xl:gap-x-8"
  > -->
  <!-- </div> -->

  <div v-if="games.length <= 0 && !isLoading" class="flex items-center text-6xl">
    <img src="/src/assets/book.png" alt="book" />
    <h2>
      NO GAMES IN YOUR LIBRARY, ADD THEM
      <RouterLink to="/games" class="text-terciary hover:text-terciary-soft">HERE</RouterLink>
    </h2>
  </div>
</template>

<style scoped></style>
