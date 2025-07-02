<script setup lang="ts">
import { setProfilePicture } from '@/utils/utils'
import { ref } from 'vue'

const props = defineProps<{
  userId: string
}>()

const emit = defineEmits(['closeModal'])

const handleSetProfilePicture = () => {
  setProfilePicture(props.userId, imgUrl.value)
  emit('closeModal')
}

const imgUrl = ref('')
</script>
<template>
  <div
    @click.self="() => $emit('closeModal')"
    class="background w-screen h-screen absolute z-10 top-0 left-0 flex items-center justify-center"
  >
    <div class="max-w-[650px] w-1/2 bg-secondary text-terciary-mute p-3 rounded">
      <p class="text-2xl mb-2">Image URL</p>
      <div class="flex gap-5">
        <input
          class="bg-terciary-mute text-secondary w-full rounded text-2xl"
          v-model="imgUrl"
          type="text"
        />
        <button class="text-secondary rounded" @click="handleSetProfilePicture">
          <i class="pi pi-save text-2xl! px-3 py-2"></i>
        </button>
      </div>
    </div>
  </div>
</template>
<style scoped>
.background {
  background-color: rgba(0, 0, 0, 0.4);
}
button {
  background-color: var(--color-terciary-mute);
}

button:hover {
  background-color: var(--color-terciary);
}
</style>
