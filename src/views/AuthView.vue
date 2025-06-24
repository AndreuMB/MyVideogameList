<script setup lang="ts">
import LoginForm from '@/components/LoginForm.vue'
import RegisterForm from '@/components/RegisterForm.vue'
import { ref } from 'vue'

const registerRoute = ref(false)
</script>

<template>
  <div class="flex flex-col items-center justify-center px-6 py-8 grow-1">
    <LoginForm v-if="!registerRoute" @register-form="(param) => (registerRoute = param)" />
    <RegisterForm v-else @register-form="(param) => (registerRoute = param)" />
  </div>
</template>
