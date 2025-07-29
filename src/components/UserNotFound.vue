<script setup lang="ts">
import ErrorMessage from './ErrorMessage.vue'
import profileIcon from '@/assets/profile.png'
</script>

<template>
  <ErrorMessage
    error_message="USER NOT EXIST, ARE YOU STALKING SOMEONE??"
    redirect_message="LETS GET BACK"
    :image="profileIcon"
  />
</template>
