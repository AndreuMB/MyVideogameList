<script setup lang="ts">
import type { Game } from '@/interfaces/GiantbombResponse'
import { ref, type Ref } from 'vue'

const games: Ref<Game[]> = ref([])
</script>

<template>
  <h1 class="text-4xl mb-10">WANT TO PLAY</h1>
  <div
    class="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 xl:gap-x-8"
  >
    <a v-for="game in games" :key="game.id" href="#" class="group bg-green-200 rounded-2xl">
      <img
        :src="game.image.medium_url"
        alt="Tall"
        class="rounded-t-2xl h-100 w-full object-cover"
      />
      <p class="p-4 pt-1 mt-1 text-lg font-medium">{{ game.name }}</p>
    </a>
  </div>
</template>

<style scoped></style>
