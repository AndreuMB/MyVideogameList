<script setup lang="ts">
import { getAuth } from 'firebase/auth'
import type { Game } from '@/interfaces/GiantbombResponse'
import { addGameToLibrary, removeGameFromLibrary } from '@/utils/utils'
import { onMounted, ref, type Ref } from 'vue'
import FavToggle from './FavToggle.vue'
import type { GameDb } from '@/interfaces/GameDb'

const props = defineProps<{
  game: Game
  isLoggedIn: boolean
  gameDb: GameDb | null
  elipsis?: boolean
}>()

const isInLibrary: Ref<boolean> = ref(false)

const auth = getAuth()

onMounted(() => {
  if (props.gameDb) {
    isInLibrary.value = props.gameDb.isInLibrary
  }
})

let timer: number

const toogleBookmark = (gameId: number, add: boolean) => {
  const user = auth.currentUser
  if (user) {
    isInLibrary.value = !isInLibrary.value

    // debounce
    if (timer) {
      clearTimeout(timer)
    }

    timer = setTimeout(async () => {
      if (add) {
        addGameToLibrary(gameId)
      } else {
        removeGameFromLibrary(gameId)
      }
    }, 1000)
  }
}
</script>

<template>
  <div class="background-secondary rounded-2xl grid grid-cols-1 relative">
    <FavToggle v-if="isLoggedIn && isInLibrary" class="absolute top-2 right-2" :gameId="game.id" />
    <img :src="game.image.medium_url" alt="Tall" class="rounded-t-2xl h-100 w-full object-cover" />
    <div class="flex justify-between p-3 items-center space-x-3">
      <RouterLink
        :to="`/gameDetails/${game.id}`"
        :class="`router-link-card text-lg font-medium text-primary
      ${elipsis ? ' text-nowrap overflow-ellipsis overflow-hidden' : ''}`"
      >
        {{ game.name }}
      </RouterLink>
      <div v-if="isLoggedIn">
        <button
          v-if="!isInLibrary"
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

<style scoped></style>
