import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import OauthCallbackView from '@/views/OauthCallbackView.vue'
import Home from '@/views/HomeView.vue'
import ReviewView from '@/views/ReviewView.vue'
import { useAuth } from '@/composables/useAuth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/oauth/callback',
      name: 'oauth-callback',
      component: OauthCallbackView,
    },
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: { requiresAuth: true },
    },
    {
      path: '/review/:id',
      name: 'review',
      component: ReviewView,
    },
  ],
})

router.beforeEach(async (to) => {
  const checkIfAuthorized = async () => {
    const { isAuthenticated, checkAuth } = useAuth()

    await checkAuth()

    if (to.meta.requiresAuth && !isAuthenticated.value) {
      router.push('/login')
    }
  }

  await checkIfAuthorized()
})

export default router
