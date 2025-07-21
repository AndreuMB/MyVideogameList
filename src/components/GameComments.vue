<script setup lang="ts">
import type { GameDb } from '@/interfaces/GameDb';
import { getGameDb, insertCommet } from '@/utils/utils';
import { onMounted, ref, type Ref } from 'vue';
import GameComment from './GameComment.vue';

const props = defineProps<{
  gameId: number
}>()

const placeholders = [
  'This game ruined my sleep schedule, and I\'m not even mad...',
  'I thought I\'d play for 10 minutes. 6 hours later...',
  'My thumbs may never recover, but...',
  'I yelled at my screen more than I should have...',
  'This game made me question my life choices... in a good way?',
  'I rage quit only three times, which is a new record...',
  'I lost friends over this game. Totally worth it.',
  'My pet now hates me for ignoring them...',
  'This game gave me trust issues. Thanks, plot twist.',
  'I went in expecting fun. I got emotional damage.',
]

const randomPlaceholder = ref('')

const comment = ref('')
const gameDb: Ref<GameDb | null> = ref(null)

onMounted(async ()=> {
  gameDb.value = await getGameDb(props.gameId)
  getRandomPlaceholder()
})

const handleInsertComment = async () => {
  await insertCommet(props.gameId, comment.value)
  comment.value = ''
  gameDb.value = await getGameDb(props.gameId)
}

const getRandomPlaceholder = () => {
  randomPlaceholder.value = placeholders[Math.floor(Math.random() * placeholders.length)]
}

</script>

<template>
  <h1 class="text-2xl font-pixel text-terciary mb-2">COMMENTS</h1>
  <div class="border-secondary border rounded p-2 mb-4">
    <p class="mb-1">☁️ Share your thoughts ☁️</p>
    <div class="flex gap-2">
      <textarea
        v-model="comment"
        class="w-full bg-terciary-mute rounded p-1 text-secondary"
        :placeholder="randomPlaceholder"
        @focusout="getRandomPlaceholder">
      </textarea>
      <button class="font-medium rounded-lg p-2 px-4 text-primary" @click="handleInsertComment">
        <i class="pi pi-send"></i>
      </button>
    </div>
  </div>

  <div v-if="gameDb && gameDb.comments">
    <div v-for="comment in gameDb.comments" :key="comment.comment">
      <GameComment class="mb-2" :game-comment="comment" />
    </div>
  </div>
  <div v-else class="p-6 rounded-lg text-secondary w-full text-center relative">
    <img
      class="!w-[50px] !h-[50px] absolute top-2 left-0"
      src="/src/assets/profile.png"
      alt="bee"
    />
    <img
      class="!w-[50px] !h-[50px] absolute bottom-2 right-0"
      src="/src/assets/profile.png"
      alt="bee"
    />
    <h2 class="text-3xl font-pixel">No comments yet</h2>
    <p>Be the first one to comment! :D</p>
  </div>
</template>

<style scoped></style>
