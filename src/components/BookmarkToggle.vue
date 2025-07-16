<script setup lang="ts">
import { addGameToLibrary, getUserGameDb, removeGameFromLibrary } from '@/utils/utils'
import { onMounted, ref } from 'vue'
import { getAuth } from 'firebase/auth'

const props = defineProps<{
  gameId: number
}>()
const emit = defineEmits(['stateChange'])

const isInLibrary = ref(false)
const auth = getAuth()

onMounted(async ()=> {
  const gameDb = await getUserGameDb(props.gameId)
  if (gameDb) {
    isInLibrary.value = gameDb.isInLibrary
  }
})

const toogleBookmark = () => {
  const user = auth.currentUser
  if (user) {
    isInLibrary.value = !isInLibrary.value

    if (isInLibrary.value) {
      addGameToLibrary(props.gameId)
    } else {
      removeGameFromLibrary(props.gameId)
    }
    emit('stateChange')
  }
}
</script>

<template>
  <button
    v-if="!isInLibrary"
    @click="toogleBookmark()"
    type="button"
    class="font-medium rounded-lg text-sm p-2 px-4 text-primary"
  >
    <i class="pi pi-bookmark"></i>
  </button>
  <button
    v-else
    @click="toogleBookmark()"
    type="button"
    class="font-medium rounded-lg text-sm p-2 px-4 text-primary"
  >
    <i class="pi pi-bookmark-fill"></i>
  </button>
</template>
