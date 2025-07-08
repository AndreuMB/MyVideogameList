<script setup lang="ts">
const emits = defineEmits(['scrollEnd'])

const SCROLL_OFFSET = 200

const handleScroll = (e: WheelEvent) => {
  const element = e.currentTarget
  if (element && element instanceof HTMLDivElement) {
    // end of scroll
    if (element.getBoundingClientRect().bottom < window.innerHeight + SCROLL_OFFSET) {
      emits('scrollEnd')
    }
  }
}
</script>
<template>
  <div
    class="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 xl:gap-x-8"
    @wheel="handleScroll"
  >
    <slot />
  </div>
</template>
