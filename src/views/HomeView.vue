<script setup lang="ts">
import GameCard from '@/components/GameCard.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import type { Game } from '@/interfaces/GiantbombResponse'
import { getGamesOrderByRelease } from '@/utils/utils'
import Carousel from 'primevue/carousel'
import { onBeforeMount, onMounted, ref, type Ref } from 'vue'
import { getCurrentUser } from 'vuefire'
import { useRouter } from 'vue-router'

const games: Ref<Game[]> = ref([])
const loading: Ref<boolean> = ref(true)
const results = 12
const resultsView = 5

const router = useRouter()

onBeforeMount(async () => {
  const user = await getCurrentUser()
  if (user) router.push('/library')
})

const responsiveOptions = ref([
  {
    breakpoint: '1600px',
    numVisible: 4,
    numScroll: 1,
  },
  {
    breakpoint: '1300px',
    numVisible: 3,
    numScroll: 1,
  },
  {
    breakpoint: '1000px',
    numVisible: 2,
    numScroll: 1,
  },
  {
    breakpoint: '700px',
    numVisible: 1,
    numScroll: 1,
  },
])

onMounted(async () => {
  loading.value = true
  const gamesCarousel = await getGamesOrderByRelease(results.toString())
  if (gamesCarousel) games.value = gamesCarousel
  loading.value = false
})
</script>
<template>
  <div class="text-center">
    <h1 class="not-md:text-4xl md:text-6xl lg:text-8xl mb-10 text-terciary font-pixel">
      MyVideogameList
    </h1>
    <h2 class="not-md:text-2xl text-4xl">Track all your favorite games in one place!</h2>
    <div class="m-10">
      <LoadingSpinner v-if="loading" />
      <Carousel
        v-else
        :value="games"
        :numVisible="resultsView"
        :numScroll="1"
        :responsiveOptions="responsiveOptions"
        circular
        :autoplayInterval="3000"
      >
        <template #item="game">
          <GameCard
            :gamesDb="null"
            class="m-5"
            :game="game.data"
            :isLoggedIn="false"
            :elipsis="true"
          />
        </template>
      </Carousel>
    </div>
  </div>
</template>
