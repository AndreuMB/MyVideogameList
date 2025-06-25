<script setup lang="ts"></script>
<template>
  <div class="flex items-center justify-center text-6xl gap-10 grow">
    <img src="/src/assets/wall.jpg" alt="wall" height="2500" width="250" />
    <div>
      <h1>FORBIDDEN</h1>
      <p class="text-2xl">Hmm... This is embarassing, you shouldn't be here.</p>
      <RouterLink to="/games" class="text-terciary hover:text-terciary-soft"
        >RETURN TO GAMES</RouterLink
      >
    </div>
  </div>
</template>
