<script setup lang="ts">
import type { Game } from '@/interfaces/GiantbombResponse'
import { onMounted, ref, type Ref } from 'vue'
import FavToggle from './FavToggle.vue'
import type { UserGameDb } from '@/interfaces/UserGameDb'
import DropdownGameState from './DropdownGameState.vue'
import BookmarkToggle from './BookmarkToggle.vue'
import { getUserGameDb } from '@/utils/utils'

const props = defineProps<{
  game: Game
  isLoggedIn: boolean
  gamesDb: UserGameDb[] | null
  elipsis?: boolean
}>()

const isInLibrary: Ref<boolean> = ref(false)
const isCompleted: Ref<boolean> = ref(false)
const userGameDb: Ref<UserGameDb | null> = ref(null)

onMounted(() => {
  if (props.gamesDb) {
    userGameDb.value = props.gamesDb.find((gamedb) => gamedb.id == props.game.id) || null
    if (userGameDb.value) {
      isInLibrary.value = userGameDb.value.isInLibrary
      isCompleted.value = userGameDb.value.state == 2
    }
  }
})

const handleStateChange = async () => {
  userGameDb.value = await getUserGameDb(props.game.id)
  if (userGameDb.value) {
    isInLibrary.value = userGameDb.value.isInLibrary
    isCompleted.value = userGameDb.value.state == 2
  }
}
</script>

<template>
  <div class="background-secondary rounded-2xl grid grid-cols-1 relative">
    <div class="absolute flex justify-between w-full p-2">
      <DropdownGameState
        v-if="isLoggedIn && isInLibrary"
        :game-id="game.id"
        @state-change="(stateId: number) => (isCompleted = stateId == 2)"
      />
      <FavToggle
        v-if="isLoggedIn && isInLibrary && isCompleted"
        :game-id="game.id"
        :game-db="userGameDb"
      />
    </div>
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
        <BookmarkToggle :game-id="game.id" @state-change="handleStateChange" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
