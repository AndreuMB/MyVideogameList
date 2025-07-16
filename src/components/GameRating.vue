<script setup lang="ts">
import type { GameDb } from '@/interfaces/GameDb'
import { changeGameRating } from '@/utils/utils'
import { onMounted, useTemplateRef } from 'vue'

const props = defineProps<{
  gameId: number
  gameDb: GameDb | null
}>()

const stars = useTemplateRef('stars')
const emit = defineEmits(['ratingChange'])

onMounted(() => {
  printRating()
})

const printRating = () => {
  if (!stars.value) return
  const starsArray = Array.from(stars.value.querySelectorAll('i'))
  if (!props.gameDb || !props.gameDb.rating || !props.gameDb.ratingContributors) {
    cleanStars(starsArray)
    return
  }

  const rating = props.gameDb.rating / props.gameDb.ratingContributors
  starsArray.forEach((star, i) => {
    if (i >= rating) {
      star.classList.remove('pi-star-fill')
      star.classList.add('pi-star')
    } else {
      star.classList.add('pi-star-fill')
      star.classList.remove('pi-star')
    }
  })
}

const handleRating = async (i: number) => {
  await changeGameRating(props.gameId, i)
  emit('ratingChange')
}

const cleanStars = (starsArray: HTMLElement[]) => {
  if (!stars.value) return
  starsArray.forEach((star) => {
      star.classList.remove('pi-star-fill')
      star.classList.add('pi-star')
  })
}

const handleRatingHover = (e: MouseEvent) => {
  const parent = e.currentTarget as HTMLElement
  const target = e.target as HTMLElement

  if (!target.matches('i')) return

  const stars = Array.from(parent.querySelectorAll('i'))
  const currentStarIndex = stars.indexOf(target)

  stars.forEach((star, i) => {
    if (i > currentStarIndex) {
      star.classList.remove('pi-star-fill')
      star.classList.add('pi-star')
    } else {
      star.classList.add('pi-star-fill')
      star.classList.remove('pi-star')
    }
  })
}

const handleRatingLeave = () => {
  printRating()
}
</script>
<template>
  <div ref="stars" @mouseover="handleRatingHover" @mouseleave="handleRatingLeave">
    <i v-for="i in 5" :key="i" class="mx-0.5 pi pi-star" @click="handleRating(i)"></i>
    ({{ gameDb?.ratingContributors || 0 }})
  </div>
</template>
