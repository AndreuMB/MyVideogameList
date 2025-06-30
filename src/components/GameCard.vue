<script setup lang="ts">
import { useDatabase } from 'vuefire'
import { ref as dbRef, get, set } from 'firebase/database'
import { getAuth } from 'firebase/auth'
import type { Game } from '@/interfaces/GiantbombResponse'
import { getLibraryGamesId } from '@/utils/utils'
import { onMounted, ref, type Ref } from 'vue'

const props = defineProps<{
  game: Game
  isLoggedIn: boolean
  elipsis?: boolean
}>()

const isOnLibrary: Ref<boolean> = ref(false)

const auth = getAuth()
const db = useDatabase()

onMounted(async () => {
  const gamesId = await getLibraryGamesId()
  if (gamesId) isOnLibrary.value = gamesId.includes(props.game.id)
})

let timer: number

const toogleBookmark = (gameId: number, add: boolean) => {
  const user = auth.currentUser
  if (user) {
    isOnLibrary.value = !isOnLibrary.value

    // debounce
    if (timer) {
      clearTimeout(timer)
    }

    timer = setTimeout(async () => {
      const gamesRef = dbRef(db, `users/${user.uid}/games`)
      if (add) {
        let gamesId = (await get(gamesRef)).val()
        if (Array.isArray(gamesId)) {
          if (gamesId.indexOf(gameId) >= 0) return
          gamesId.push(gameId)
        } else gamesId = [gameId]
        set(gamesRef, gamesId)
      } else {
        const libraryGamesId = await getLibraryGamesId()
        if (libraryGamesId) {
          const index = libraryGamesId.indexOf(gameId)
          if (index === -1) return
          libraryGamesId.splice(index, 1)
          set(gamesRef, libraryGamesId)
        }
      }
    }, 1000)
  }
}
</script>

<template>
  <div class="background-secondary rounded-2xl grid grid-cols-1">
    <RouterLink
      :to="`/gameDetails/${game.id}`"
      class="rounded-t-2xl h-100 w-full object-cover cursor-pointer background-terciary"
    >
      <img
        :src="game.image.medium_url"
        alt="Tall"
        class="rounded-t-2xl h-100 w-full object-cover cursor-pointer background-secondary"
      />
    </RouterLink>
    <div class="flex justify-between p-3 items-center space-x-3">
      <p :class="`text-lg font-medium text-primary ${ elipsis ? ' text-nowrap overflow-ellipsis overflow-hidden' : ''}`">{{ game.name }}</p>
      <div v-if="isLoggedIn">
        <button
          v-if="!isOnLibrary"
          @click="toogleBookmark(game.id, true)"
          type="button"
          class="font-medium rounded-lg text-sm p-2 px-4 text-primary"
        >
          <i class="pi pi-bookmark"></i>
        </button>
        <button
          v-else
          @click="toogleBookmark(game.id, false)"
          type="button"
          class="font-medium rounded-lg text-sm p-2 px-4 text-primary"
        >
          <i class="pi pi-bookmark-fill"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
img:hover {
  opacity: 0.5;
}
</style>
