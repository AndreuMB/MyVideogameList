import { createRouter, createWebHistory } from 'vue-router'
import LibraryView from '../views/MyLibraryView.vue'
import { getCurrentUser } from 'vuefire'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/home',
      alias: '/',
      name: 'Home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/library',
      name: 'Library',
      component: LibraryView,
      meta: { isProtected: true },
    },
    {
      path: '/games',
      name: 'Games',
      component: () => import('../views/GamesView.vue'),
    },
    {
      path: '/games/:gameName',
      name: 'GamesSearch',
      component: () => import('../views/GamesView.vue'),
    },
    {
      path: '/gameDetails/:gameId',
      name: 'GameDetails',
      component: () => import('../views/GameDetailsView.vue'),
    },
    {
      path: '/profile/:username',
      name: 'Profile',
      component: () => import('../views/ProfileView.vue')
    },
    {
      path: '/auth',
      name: 'Auth',
      component: () => import('../views/AuthView.vue'),
    },
    {
      path: '/forbidden',
      name: 'Forbidden',
      component: () => import('../views/ForbiddenView.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: '404',
      component: () => import('../views/404View.vue'),
    },
  ],
})

router.beforeEach(async (to) => {
  const user = await getCurrentUser()
  if (to.meta.isProtected && !user) return { name: 'Forbidden' }
})

export default router
