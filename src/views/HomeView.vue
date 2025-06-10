<script setup lang="ts">
// import axios from 'axios'
import type { Game, GiantbombResponse } from '@/interfaces/GiantbombResponse'
import jsonp from 'jsonp'
import { ref, type Ref } from 'vue'

const games: Ref<Game[]> = ref([])

const getGames = () => {
  // const gb = giantbomb('11256bb6a7492869a192cac926dc8bc7a432a234')
  // gb.games.get(16909, (err: unknown, res: unknown, json: unknown) => {
  //   console.log(json)
  // })
  // const response = await axios.get('https://api.warframestat.us/mods/')
  // const response = await axios.get(
  //   'https://www.giantbomb.com/api/accessories/?api_key=11256bb6a7492869a192cac926dc8bc7a432a234&format=jsonp&json_callback=test',
  // )
  // https://www.giantbomb.com/api/games/?api_key=11256bb6a7492869a192cac926dc8bc7a432a234&format=jsonp&json_callback=test&limit=4
  jsonp(
    'https://www.giantbomb.com/api/games/?',
    {
      param: `api_key=${import.meta.env.VITE_GIANT_BOMB_KEY}&sort=original_release_date:desc&limit=10&format=jsonp&json_callback=test`,
    },
    test,
  )
  // const headers = {
  //   'Client-ID': '410iigp8snqsqmowfz4rboxkblf1or',
  //   Authorization: 'bc94wly1rhj6srqd2lvlnxmbz8ugd5',
  // }
  // const response = await axios.post('https://api.igdb.com/v4/games', 'fields *; limit 10;', {
  //   headers,
  // })
  // console.log(response)
  // return response

  function test(err: Error | null, data: GiantbombResponse) {
    if (err) {
      console.log(err)
      return
    }

    console.log(data.results)
    games.value = data.results
  }
}

getGames()
</script>

<template>
  <h1 class="text-4xl mb-10">WANT TO PLAY</h1>
  <!-- <div
    class="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 xl:gap-x-8"
  >
    <a href="#" class="group bg-green-200 rounded-2xl">
      <img
        src="https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-04-image-card-01.jpg"
        alt="Tall"
        class="rounded-t-2xl"
      />
      <p class="p-4 pt-1 mt-1 text-lg font-medium">Undertale</p>
    </a>
  </div> -->
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
