<script setup async lang="ts">
import { useDatabase } from 'vuefire'
import { ref as dbRef, get } from 'firebase/database'
import jsonp from 'jsonp'
import type { Game, GiantbombResponse } from '@/interfaces/GiantbombResponse'
import { ref, type Ref } from 'vue'
import GameCard from '@/components/GameCard.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

interface UserProfile {
  id: string
  games?: object
}

export interface GameDb {
  id: string
  gameId: string
}

const exampleGame: Game = {
  aliases: 'GTA V, Grand Theft Auto 5',
  api_detail_url: 'https://www.giantbomb.com/api/game/3030-4664/',
  date_added: '2013-09-17 00:00:00',
  date_last_updated: '2023-12-01 10:45:23',
  deck: 'An open-world action-adventure game set in Los Santos.',
  description: '<p>Grand Theft Auto V is an open-world crime game developed by Rockstar North.</p>',
  expected_release_day: 17,
  expected_release_month: 9,
  expected_release_quarter: 'Q3',
  expected_release_year: 2013,
  guid: '3030-4664',
  id: 4664,
  image: {
    icon_url: 'https://example.com/image/icon.jpg',
    medium_url: 'https://example.com/image/medium.jpg',
    screen_url: 'https://example.com/image/screen.jpg',
    screen_large_url: 'https://example.com/image/screen_large.jpg',
    small_url: 'https://example.com/image/small.jpg',
    super_url: 'https://example.com/image/super.jpg',
    thumb_url: 'https://example.com/image/thumb.jpg',
    tiny_url: 'https://example.com/image/tiny.jpg',
    original_url: 'https://example.com/image/original.jpg',
    image_tags: 'cover, logo',
  },
  image_tags: [
    {
      api_detail_url: 'https://www.giantbomb.com/api/image_tag/1/',
      name: 'cover',
      total: 12,
    },
    {
      api_detail_url: 'https://www.giantbomb.com/api/image_tag/2/',
      name: 'logo',
      total: 5,
    },
  ],
  name: 'Grand Theft Auto V',
  number_of_user_reviews: 10500,
  original_game_rating: 'Mature',
  original_release_date: '2013-09-17',
  platforms: [
    {
      api_detail_url: 'https://www.giantbomb.com/api/platform/1/',
      id: 1,
      name: 'PlayStation 3',
      site_detail_url: 'https://www.giantbomb.com/playstation-3/3045-35/',
      abbreviation: 'PS3',
    },
    {
      api_detail_url: 'https://www.giantbomb.com/api/platform/2/',
      id: 2,
      name: 'Xbox 360',
      site_detail_url: 'https://www.giantbomb.com/xbox-360/3045-20/',
      abbreviation: 'X360',
    },
    {
      api_detail_url: 'https://www.giantbomb.com/api/platform/3/',
      id: 3,
      name: 'PC',
      site_detail_url: 'https://www.giantbomb.com/pc/3045-94/',
      abbreviation: 'PC',
    },
  ],
  site_detail_url: 'https://www.giantbomb.com/games/3030-4664/',
  ref: 'custom_ref_123',
}

const games: Ref<Game[]> = ref([exampleGame])
const gamesDb: Ref<GameDb[]> = ref([])
const db = useDatabase()
const auth = getAuth()
const isLoading = ref(true)

onAuthStateChanged(auth, async (user) => {
  if (user) {
    const uid = user.uid
    loadGames(uid)
  }
})

const loadGames = async (uid: string) => {
  isLoading.value = true
  gamesDb.value = await getUserGamesDb(uid)
  games.value = await getLibraryGames(gamesDb.value)
  isLoading.value = false
}

const reloadGames = () => {
  const user = auth.currentUser
  if (user) loadGames(user.uid)
}

const getUserGamesDb = async (userId: string): Promise<GameDb[]> => {
  const userRef = await get(dbRef(db, `users/${userId}`))
  const profile: UserProfile = await userRef.val()

  if (!profile || !profile.games) return []

  const gamesDb: GameDb[] = []

  for (const [key, value] of Object.entries(profile.games)) {
    const gameId = value
    const gameRef: GameDb = {
      id: key,
      gameId,
    }
    gamesDb.push(gameRef)
  }

  return gamesDb
}

const getLibraryGames = async (gamesDb: GameDb[]): Promise<Game[]> => {
  const gamesData: Game[] = []

  for await (const gameDb of gamesDb) {
    const game = await searchGame(gameDb.gameId)
    game.ref = gameDb.id
    gamesData.push(game)
  }

  return gamesData
}

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
  <LoadingSpinner v-if="isLoading" />

  <div
    v-else
    class="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 xl:gap-x-8"
  >
    <GameCard
      :game="game"
      :is-logged-in="true"
      @on-delete="reloadGames"
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
