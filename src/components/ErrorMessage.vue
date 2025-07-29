<script setup lang="ts">
defineProps<{
  error_message: string
  redirect_message: string
  image: string
}>()
</script>

<template>
  <img
    class="absolute top-0 left-0 -z-10"
    height="125"
    width="125"
    src="/src/assets/spidernet.png"
    alt="net"
  />

  <div class="md:flex not-md:text-center items-center justify-center md:p-25 gap-6">
    <img class="md:max-w-1/2" :src="image" alt="chest" />
    <div>
      <p class="text-4xl md:text-6xl">{{ error_message }}</p>
      <RouterLink to="/games" class="text-terciary hover:text-terciary-soft text-2xl">
        {{ redirect_message }}
      </RouterLink>
    </div>
  </div>
</template>
