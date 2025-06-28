<script setup async lang="ts">
import { onMounted, ref, type Ref } from 'vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { useRoute } from 'vue-router'
import type { Game } from '@/interfaces/GiantbombResponse'
import { getGameById } from '@/utils/utils'

const isLoading = ref(true)
const route = useRoute()
const game: Ref<Game | null> = ref(null)



onMounted(async () => {
  isLoading.value = true
  const gameId = Number.parseInt(route.params.gameId.toString())
  game.value = await getGameById(gameId, '')
  // document.querySelectorAll('img[data-src]').forEach(img => {
  //   console.log('enter foreach img', img);

  //   // img.src = img.getAttribute('data-src');
  //   // if (img.hasAttribute('data-srcset')) {
  //   //   img.srcset = img.getAttribute('data-srcset');
  //   // }
  // });
  isLoading.value = false
  setTimeout(()=> {
  // (document.querySelectorAll('img[data-src]') as NodeListOf<HTMLImageElement>).forEach((img) => {
  //   console.log('enter foreach img', img);
  //   img.src = img.getAttribute('data-src')!;
  //   if (img.getAttribute('data-srcset') != null) {
  //     img.srcset = img.getAttribute('data-srcset')!;
  //   }
  //   // const imgInfo = img.nextElementSibling()
  // });

  document.querySelectorAll('figure').forEach((figure) => {
    figure.remove()
//     console.log("enter figjure" , figure.nextElementSibling);
// const figureDesc = figure.nextElementSibling
//    const div = document.createElement("div")
//   //figure.append(div)
//   div.append(figure)
// if (figureDesc) div.append(figureDesc)
//   document.getElementsByClassName("description")[0].append(div)

  });

  },1)

})
</script>

<template>
  <LoadingSpinner v-if="isLoading || game == null" />
  <div v-else>
    <div class="mb-10">
      <h1 class="text-4xl text-terciary">{{ game.name }}</h1>
      <p class="text-2xl">{{ game.date_added.split(' ')[0] }}</p>
    </div>
    <div class="flex gap-10">
      <div class="max-w-1/4">
        <img class="" :src="game.image.medium_url" alt="gameImg" />
        <h2 class="text-2xl mt-5 text-terciary">PLATFORMS</h2>
        <p v-for="platform in game.platforms" :key="platform.id">
          {{ platform.name }}
        </p>
      </div>
      <div class="w-3/4">
        <h2 class="text-2xl text-terciary">DESCRIPTION</h2>
        <div
          v-if="game.description"
          :class="$style.description"
          class="description"
          v-html="game.description.replace('<h2>Overview</h2>', '')"
        ></div>
        <h2 v-else class="text-2xl text-terciary">NO DESCRIPTION AVAILABLE :(</h2>
      </div>
    </div>
  </div>
</template>

<style module>
.description figure {
  /* width: auto !important;
  max-width: 40%;
  float: left;
  margin-right: 1rem;
  margin-bottom: 0.5rem; */
  /* img{
    /* max-height: 200px; */
    /* margin-top: 100px;
  } */
  /* + p {
    margin-bottom: 100px;
  } */
   /* figcaption {
    color: pink;
   } */
}

.description {

    h2 {
      font-size: 20px;
      margin-top: 5px;
    }
}

.description div {
  display: flex;
  flex-direction: column column;
}
</style>
