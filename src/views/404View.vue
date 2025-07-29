<script setup lang="ts">
import ErrorMessage from '@/components/ErrorMessage.vue'
import emptyChest from '@/assets/emptyChestFit.png'
</script>

<template>
  <ErrorMessage
    error_message="SERIUSLY, HOW DID YOU ENDED UP HERE??"
    redirect_message="LETS GET BACK"
    :image="emptyChest"
  />
</template>
