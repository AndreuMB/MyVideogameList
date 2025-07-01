<script setup lang="ts">
import { addFavoriteGameId, getFavoriteGamesId, removeFavoriteGameId } from '@/utils/utils';
import { onMounted, ref, type Ref } from 'vue';
import { getCurrentUser } from 'vuefire';

const props = defineProps<{
  gameId: number
}>()

const isOnFavorites = ref(false)
const favGames:Ref<number[] | null> = ref(null)

onMounted(async () => {
  favGames.value = await getFavoriteGamesId()

  if (favGames.value) isOnFavorites.value = favGames.value.includes(props.gameId)
})

let timer = 0
const toogleFavorite = async () => {
  const user = await getCurrentUser()
  if (user) {

    if (!isOnFavorites.value && Array.isArray(favGames.value) && favGames.value.length >= 3) {
      console.log("cant have more than 3 favorite games");
      return
    }

    isOnFavorites.value = !isOnFavorites.value


    // debounce
    if (timer) {
      clearTimeout(timer)
    }

    timer = setTimeout(async () => {
      if (isOnFavorites.value) {
        await addFavoriteGameId(props.gameId)
      } else {
        await removeFavoriteGameId(props.gameId)
      }
      favGames.value = await getFavoriteGamesId()
    }, 1000)
  }
}
</script>

<template>
  <button
    v-if="!isOnFavorites"
    @click="toogleFavorite()"
    class="font-medium rounded-lg text-sm p-2 px-4 text-primary bg-yellow-300! hover:bg-yellow-200!"
  >
    <i class="pi pi-star"></i>
  </button>
  <button
    v-else
    @click="toogleFavorite()"
    class="font-medium rounded-lg text-sm p-2 px-4 text-primary bg-yellow-300! hover:bg-yellow-200!"
  >
    <i class="pi pi-star-fill"></i>
  </button>
</template>
