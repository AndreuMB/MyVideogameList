<script setup lang="ts">
import GameCard from '@/components/GameCard.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import type { Game, GiantbombResponse } from '@/interfaces/GiantbombResponse'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import jsonp from 'jsonp'
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
    games.value = await searchGamesByName()
  } else {
    games.value = await getNewGames()
  }
  loading.value = false
}

function getNewGames(): Promise<Game[]> {
  return new Promise((resolve, reject) => {
    jsonp(
      'https://www.giantbomb.com/api/games/?',
      {
        param: `api_key=${import.meta.env.VITE_GIANT_BOMB_KEY}&sort=original_release_date:desc&limit=12&format=jsonp&json_callback=none`,
      },
      (err: Error | null, data: GiantbombResponse<Game[]>) => {
        if (err) {
          reject(err)
        } else {
          resolve(data.results)
        }
      },
    )
  })
}

function searchGamesByName(): Promise<Game[]> {
  return new Promise((resolve, reject) => {
    jsonp(
      'https://www.giantbomb.com/api/games/?',
      {
        param: `api_key=${import.meta.env.VITE_GIANT_BOMB_KEY}&sort=original_release_date:desc&filter=name:${route.params.gameName}&limit=10&format=jsonp&json_callback=none`,
      },
      (err: Error | null, data: GiantbombResponse<Game[]>) => {
        if (err) {
          reject(err)
        } else {
          resolve(data.results)
        }
      },
    )
  })
}
</script>

<template>
  <h1 class="text-4xl mb-10">GAMES</h1>
  <div
    class="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 xl:gap-x-8"
  >
    <LoadingSpinner v-if="loading" />
    <GameCard
      @on-state-change="searchGames"
      :game="game"
      :is-logged-in="isLoggedIn"
      v-for="game in games"
      :key="game.id"
    />
  </div>
</template>

<style scoped></style>
