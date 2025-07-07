<template>
  <Listbox as="div" v-model="selected">
    <div class="relative">
      <ListboxButton class="grid h-full w-full cursor-default grid-cols-1 rounded-md bg-white py-1.5 pr-2 pl-3 text-left text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600">
        <span class="col-start-1 row-start-1 flex items-center gap-3 px-1">
          <i :class="`pi pi-${selected.icon}`"></i>
          <span class="block truncate">{{ selected.name }}</span>
          <i class="pi pi-angle-down"></i>
        </span>
      </ListboxButton>

      <transition leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100" leave-to-class="opacity-0">
        <ListboxOptions class="absolute z-10 mt-1  rounded-md bg-terciary py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-hidden ">
          <ListboxOption as="template" v-for="gameState in gameStates" :key="gameState.id" :value="gameState" v-slot="{ active, selected }">
            <li @click="handleChangeGameState(gameState.id)" :class="[active ? 'bg-indigo-600 text-white outline-hidden' : 'text-gray-900', 'relative cursor-default py-2 pr-9 pl-3 select-none']">
              <div class="flex items-center">
                <i :class="`pi pi-${gameState.icon}`"></i>
                <span :class="[selected ? 'font-semibold' : 'font-normal', 'ml-3 block truncate']">{{ gameState.name }}</span>
              </div>
            </li>
          </ListboxOption>
        </ListboxOptions>
      </transition>
    </div>
  </Listbox>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/vue'
import { changeGameState, getGameState } from '@/utils/utils';

  const props = defineProps<{
    gameId: number
  }>()

  interface GameState {
    id: number,
    name: string,
    icon: string
  }

  const gameStates: GameState[] = [
    {
      id: 1,
      name: 'Stand By',
      icon:'stop'
    },
    {
      id: 2,
      name: 'Playing',
      icon:'play'
      },
    {
      id: 3,
      name: 'Finished',
      icon:'check'
    }
  ]

  const selected = ref(gameStates[0])

  const handleChangeGameState = (gameStateId: number) => {
    changeGameState(props.gameId,gameStateId)
  }

  onMounted(async ()=>{
    const gameStateId = await getGameState(props.gameId)
    const currentGameState = gameStates.find(gs=> gs.id === gameStateId)
    if (currentGameState) selected.value = currentGameState
  })

</script>
