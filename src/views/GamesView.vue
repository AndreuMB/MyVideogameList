<script setup lang="ts">
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import type { Game, GiantbombResponse } from '@/interfaces/GiantbombResponse'
import jsonp from 'jsonp'
import { onMounted, ref, watch, type Ref } from 'vue'
import { useRoute } from 'vue-router'
// import { database, database2, usersRef } from '../main'
// import { useCollection } from 'vuefire'
// import { collection } from 'firebase/firestore'

const games: Ref<Game[]> = ref([])
const route = useRoute()
const loading: Ref<boolean> = ref(false)

onMounted(async () => {
  searchGames()
  // const users = useCollection(collection(database2, 'users'))
  // console.log('users', users.value)
})

watch(route, async () => {
  searchGames()
})

async function searchGames() {
  loading.value = true
  games.value = []
  if (route.params.gameName) {
    games.value = await fetchGames()
  } else {
    games.value = await getGames()
  }
  loading.value = false
}

function getGames(): Promise<[]> {
  return new Promise((resolve, reject) => {
    jsonp(
      'https://www.giantbomb.com/api/games/?',
      {
        param: `api_key=${import.meta.env.VITE_GIANT_BOMB_KEY}&sort=original_release_date:desc&limit=10&format=jsonp&json_callback=none`,
      },
      (err: Error | null, data: GiantbombResponse) => {
        if (err) {
          reject(err)
        } else {
          resolve(data.results)
        }
      },
    )
  })
}

function fetchGames(): Promise<[]> {
  return new Promise((resolve, reject) => {
    jsonp(
      'https://www.giantbomb.com/api/games/?',
      {
        param: `api_key=${import.meta.env.VITE_GIANT_BOMB_KEY}&sort=original_release_date:desc&filter=name:${route.params.gameName}&limit=10&format=jsonp&json_callback=none`,
      },
      (err: Error | null, data: GiantbombResponse) => {
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
  <!-- <SearchBar @game-search="setGames" /> -->
  <div
    class="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 xl:gap-x-8"
  >
    <LoadingSpinner v-if="loading" />
    <a v-for="game in games" :key="game.id" href="#" class="group bg-green-200 rounded-2xl">
      <img
        :src="game.image.medium_url"
        alt="Tall"
        class="rounded-t-2xl h-100 w-full object-cover"
      />
      <p class="p-4 pt-1 mt-1 text-lg font-medium">{{ game.name }}</p>
    </a>
  </div>
</template>

<style scoped></style>
