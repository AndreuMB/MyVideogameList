<script setup lang="ts">
import { useDatabase } from 'vuefire'
import { ref as dbRef, push, ref, remove, set } from 'firebase/database'
import { getAuth } from 'firebase/auth'
import type { GameDb } from '../views/MyLibraryView.vue'
import type { Game } from '@/interfaces/GiantbombResponse'

defineProps<{
  game: Game
  isLoggedIn: boolean
  userLibrary?: GameDb
}>()

const emit = defineEmits(['onDelete'])

const auth = getAuth()
const db = useDatabase()
function addToMyLibrary(gameId: number) {
  const user = auth.currentUser
  if (user) {
    const gamesRef = dbRef(db, `users/${user.uid}/games`)
    const newGameRef = push(gamesRef)
    set(newGameRef, gameId)
  }
}

async function deleteFromMyLibrary(gameDbId: string) {
  const user = auth.currentUser
  if (user) {
    // const gamesRef = dbRef(db, `users/${user.uid}/games`)
    const gamesRef2 = ref(db, `users/${user.uid}/games/${gameDbId}`)
    remove(gamesRef2)
    emit('onDelete')
  }
}
</script>

<template>
  <div class="background-secondary rounded-2xl grid grid-cols-1">
    <div class="rounded-t-2xl h-100 w-full object-cover cursor-pointer background-terciary">
      <img
        :src="game.image.medium_url"
        alt="Tall"
        class="rounded-t-2xl h-100 w-full object-cover cursor-pointer background-secondary"
      />
    </div>
    <div class="flex justify-between p-3 items-center space-x-3">
      <p class="text-lg font-medium text-primary">{{ game.name }}</p>
      <div v-if="isLoggedIn">
        <button
          v-if="!game.ref"
          @click="addToMyLibrary(game.id)"
          type="button"
          class="font-medium rounded-lg text-sm p-2 px-4 text-primary"
        >
          <i class="pi pi-bookmark"></i>
        </button>
        <button
          v-else
          @click="deleteFromMyLibrary(game.ref)"
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
