<script setup lang="ts">
import { useDatabase } from 'vuefire'
import { ref as dbRef, push, update } from 'firebase/database'
import { getAuth } from 'firebase/auth'

defineProps({
  game: { type: Object, required: true },
  isLoggedIn: { type: Boolean, required: true },
})

const auth = getAuth()
const db = useDatabase()
function addToMyLibrary(gameId: number) {
  console.log('add ' + gameId)
  const user = auth.currentUser
  if (user) {
    const userRef = dbRef(db, `users/${user.uid}/games`)
    const newGame = push(userRef)
    update(dbRef(db), newGame)
    // set(userRef, {
    //   games: [gameId],
    // })
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
      <button
        v-if="isLoggedIn"
        @click="addToMyLibrary(game.id)"
        type="button"
        class="font-medium rounded-lg text-sm p-2 px-4 text-primary"
      >
        Save
      </button>
    </div>
  </div>
</template>

<style scoped>
img:hover {
  /* background-color: pink; */
  opacity: 0.5;
}
</style>
