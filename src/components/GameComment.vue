<script setup lang="ts">
import type { GameDbComment } from '@/interfaces/GameDb';
import type { User } from '@/interfaces/User';
import { getUser } from '@/utils/utils';
import { onMounted, ref, type Ref } from 'vue';
import defaultProfileImage from '/src/assets/profile.png'

const props = defineProps<{
  gameComment: GameDbComment
}>()

const userDb: Ref<User | null> = ref(null)
onMounted(async ()=> {
  userDb.value = await getUser(props.gameComment.usernameId)
})
</script>
<template>
  <div v-if="userDb" class="flex gap-2">
     <img
        class="mr-2 rounded-full !w-[50px] !h-[50px]"
        :src="userDb.picture || defaultProfileImage"
        :alt="userDb.username"
      />
    <div class="p-6 bg-secondary rounded-lg text-primary w-full">
      <div class="flex justify-between items-center mb-2">
        <div class="flex items-center">
          <router-link
            :to="`/profile/${userDb.username}`"
            class="inline-flex items-center mr-3 font-semibold hover:text-terciary-mute"
          >

            {{ userDb.username }}
          </router-link>
          <p>
            <time pubdate :datetime="gameComment.date">{{ gameComment.date }}</time>
          </p>
        </div>
      </div>
      <p>{{ gameComment.comment }}</p>
    </div>
  </div>
</template>
