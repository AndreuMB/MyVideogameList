<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavbarMenu from './components/NavbarMenu.vue'
</script>

<template>
  <!-- Background Image Honeycomb -->
  <img
    src="@/assets/honeycomb.png"
    alt="honeycomb"
    class="absolute top-0 right-0 -z-10 opacity-30"
    height="450"
    width="450"
  />

  <NavbarMenu />

  <RouterView />
</template>
