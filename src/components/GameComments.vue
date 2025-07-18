<script setup lang="ts">
import type { GameDb } from '@/interfaces/GameDb';
import { getGameDb, insertCommet } from '@/utils/utils';
import { onMounted, ref, type Ref } from 'vue';
import GameComment from './GameComment.vue';

const props = defineProps<{
  gameId: number
}>()

const comment = ref('')
const gameDb: Ref<GameDb | null> = ref(null)

onMounted(async ()=> {
  gameDb.value = await getGameDb(props.gameId)
})

const handleInsertComment = async () => {
  await insertCommet(props.gameId, comment.value)
  comment.value = ''
  gameDb.value = await getGameDb(props.gameId)
}
</script>

<template>
  <h1 class="text-2xl font-pixel text-terciary">COMMENTS</h1>
  <p>Share your thoughts</p>
  <div class="text-right">
    <textarea v-model="comment" class="w-full bg-terciary-mute"></textarea>
    <button class="font-medium rounded-lg p-2 px-4 text-primary" @click="handleInsertComment">Send</button>
  </div>
  <div v-if="gameDb && gameDb.comments" class="mt-4">
    <div v-for="comment in gameDb.comments" :key="comment.comment">
      <GameComment class="mb-2" :game-comment="comment" />
    </div>
  </div>
  <div v-else>
    <h2>Be the first one to comment! :D</h2>
  </div>
</template>

<style scoped></style>
