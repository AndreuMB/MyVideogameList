<script setup lang="ts">
import { addGameToFavorites, countUserFavorites, removeGameFromFavorites } from '@/utils/utils'
import { onMounted, ref } from 'vue'
import { getCurrentUser } from 'vuefire'
import { useToast } from 'vue-toast-notification'
import type { UserGameDb } from '@/interfaces/UserGameDb'

const props = defineProps<{
  gameId: number
  gameDb: UserGameDb | null
}>()

const isOnFavorites = ref(false)
// const favGames: Ref<number[] | null> = ref(null)
const toast = useToast()

onMounted(async () => {
  // favGames.value = await getFavoriteGamesId()
  // if (favGames.value) isOnFavorites.value = favGames.value.includes(props.gameId)

  if (props.gameDb) {
    isOnFavorites.value = !!props.gameDb.favorite
  }
})

let timer = 0
let inProgress = false
const toogleFavorite = async () => {
  const user = await getCurrentUser()
  if (user) {
    // add fav
    let favoritesCount = await countUserFavorites()
    if (inProgress) favoritesCount++
    if (!isOnFavorites.value && favoritesCount >= 3) {
      toast.error("You can't have more than 3 favorite games")
      return
    }

    isOnFavorites.value = !isOnFavorites.value
    inProgress = true

    // debounce
    if (timer) {
      clearTimeout(timer)
    }

    timer = setTimeout(async () => {
      if (isOnFavorites.value) {
        await addGameToFavorites(props.gameId)
      } else {
        await removeGameFromFavorites(props.gameId)
      }
      inProgress = false
    }, 1000)
  }
}
</script>

<template>
  <button
    type="button"
    v-if="!isOnFavorites"
    @click="toogleFavorite()"
    class="font-medium rounded-lg text-sm p-2 px-4 text-primary bg-terciary hover:bg-terciary-soft"
  >
    <i class="pi pi-star"></i>
  </button>
  <button
    v-else
    @click="toogleFavorite()"
    class="font-medium rounded-lg text-sm p-2 px-4 text-primary bg-terciary hover:bg-terciary-soft"
  >
    <i class="pi pi-star-fill"></i>
  </button>
</template>
