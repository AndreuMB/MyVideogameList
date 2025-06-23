<script setup async lang="ts">
import { useDatabase, useDatabaseObject, type VueDatabaseDocumentData } from 'vuefire'
import { ref as dbRef } from 'firebase/database'
import jsonp from 'jsonp'
import type { Game, GiantbombResponse } from '@/interfaces/GiantbombResponse'
import { onMounted, ref, type Ref } from 'vue'
import GameCard from '@/components/GameCard.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const games: Ref<Game[]> = ref([])

const db = useDatabase()

interface UserProfile {
  id: string
  games?: string
}

const getLibraryGames = async (): Promise<Game[]> => {
  const profilePromise = useDatabaseObject(dbRef(db, 'users/xvTiar3wRrWf3FU3ONrq2S99FCs1')).promise
  const profile: VueDatabaseDocumentData<UserProfile> | undefined = await profilePromise.value

  if (!profile || !profile.games) return []
  const gameIds = Object.values(profile.games)

  const gamesPromise: Promise<Game>[] = []
  gameIds.forEach(async (gameId) => {
    const gamePromise = searchGame(gameId)
    gamesPromise.push(gamePromise)
  })

  const games: Game[] = await Promise.all(gamesPromise)

  return games
}

onMounted(async () => {
  games.value = await getLibraryGames()
  console.log(games.value)
})

function searchGame(gameId: string): Promise<Game> {
  return new Promise((resolve, reject) => {
    jsonp(
      'https://www.giantbomb.com/api/games/?',
      {
        param: `api_key=${import.meta.env.VITE_GIANT_BOMB_KEY}&sort=original_release_date:desc&filter=id:${gameId}&limit=20&format=jsonp&json_callback=none`,
      },
      (err: Error | null, data: GiantbombResponse<Game[]>) => {
        if (err) {
          reject(err)
        } else {
          resolve(data.results[0])
        }
      },
    )
  })
}
</script>

<template>
  <h1 class="text-4xl mb-10">MY LIBRARY</h1>

  <div
    class="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 xl:gap-x-8"
  >
    <LoadingSpinner v-if="false" />
    <GameCard :game="game" :is-logged-in="true" v-for="game in games" :key="game.id" />
  </div>
</template>

<style scoped></style>
