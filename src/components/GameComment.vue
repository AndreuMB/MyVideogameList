<script setup lang="ts">
import type { GameDbComment } from '@/interfaces/GameDb';
import type { User } from '@/interfaces/User';
import { getUser } from '@/utils/utils';
import { onMounted, ref, type Ref } from 'vue';

const props = defineProps<{
  gameComment: GameDbComment
}>()

const userDb: Ref<User | null> = ref(null)
onMounted(async ()=> {
  userDb.value = await getUser(props.gameComment.usernameId)
})
</script>
<template>
   <div v-if="userDb" class="p-6 bg-secondary rounded-lg text-primary">
        <div class="flex justify-between items-center mb-2">
            <div class="flex items-center">
                <p
                  class="inline-flex items-center mr-3 font-semibold"><img
                  class="mr-2 w-6 h-6 rounded-full"
                  :src="userDb.picture"
                  :alt="userDb.username"
                >
                  {{ userDb.username }}
                </p>
                <p>
                  <time pubdate :datetime="gameComment.date">{{ gameComment.date }}</time>
                </p>
            </div>
        </div>
        <p class="">{{ gameComment.comment }}</p>
    </div>
</template>
