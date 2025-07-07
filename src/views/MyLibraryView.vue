<script setup async lang="ts">
import type { Game } from '@/interfaces/GiantbombResponse'
import { ref, type Ref } from 'vue'
import GameCard from '@/components/GameCard.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { getGamesDb, getGamesDbDetails } from '@/utils/utils'
import type { GameDb } from '@/interfaces/GameDb'

const games: Ref<Game[]> = ref([])

const auth = getAuth()
const isLoading = ref(true)
const gamesDb: Ref<GameDb[] | null> = ref(null)

onAuthStateChanged(auth, async (user) => {
  if (user) {
    loadGames()
  }
})

const loadGames = async () => {
  isLoading.value = true
  const gamesUser = await getGamesDb()

  if (gamesUser) {
    const gamesInLibrary = gamesUser.filter((game) => game.isInLibrary)
    gamesDb.value = gamesInLibrary
    games.value = await getGamesDbDetails(gamesInLibrary)
  }

  isLoading.value = false
}
</script>

<template>
  <h1 class="text-4xl mb-10">MY LIBRARY</h1>
  <LoadingSpinner v-if="isLoading" />

  <div
    v-else
    class="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 xl:gap-x-8"
  >
    <GameCard
      :game="game"
      :gamesDb="gamesDb"
      :is-logged-in="true"
      v-for="game in games"
      :key="game.id"
    />
  </div>

  <div v-if="games.length <= 0 && !isLoading" class="flex items-center text-6xl">
    <img src="/src/assets/book.png" alt="book" />
    <p>
      NO GAMES IN YOUR LIBRARY, ADD THEM
      <RouterLink to="/games" class="text-terciary hover:text-terciary-soft">HERE</RouterLink>
    </p>
  </div>
</template>

<style scoped></style>
