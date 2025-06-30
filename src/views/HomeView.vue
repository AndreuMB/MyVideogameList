<script setup lang="ts">
import GameCard from '@/components/GameCard.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import type { Game } from '@/interfaces/GiantbombResponse';
import { getGamesOrderByRelease } from '@/utils/utils';
import Carousel from 'primevue/carousel';
import { onMounted, ref, type Ref } from 'vue';

const games: Ref<Game[]> = ref([])
const loading: Ref<boolean> = ref(true)

const responsiveOptions = ref([
  {
    breakpoint: '1600px',
    numVisible: 4,
    numScroll: 1
  },
  {
    breakpoint: '1300px',
    numVisible: 3,
    numScroll: 1
  },
  {
    breakpoint: '1000px',
    numVisible: 2,
    numScroll: 1
  },
  {
    breakpoint: '700px',
    numVisible: 1,
    numScroll: 1
  },
]);


onMounted(async ()=>{
  loading.value = true
  games.value = await getGamesOrderByRelease()
  loading.value = false
})
</script>
<template>
  <div class="text-center">
    <h1 class="text-9xl mb-10 text-terciary">MyVideogameList</h1>
    <p class="text-4xl">Track all your games in one place</p>
    <div class="m-10">
      <LoadingSpinner v-if="loading" />
      <Carousel v-else :value="games" :numVisible="5" :numScroll="1"
      :responsiveOptions="responsiveOptions" circular :autoplayInterval="3000">
        <template #item="game">
            <GameCard class="m-5" :game="game.data" :isLoggedIn="false" :elipsis="true" />
        </template>
      </Carousel>
    </div>

  </div>
</template>
