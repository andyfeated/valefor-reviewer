import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import OauthCallbackView from '@/views/OauthCallbackView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/oauth/callback',
      name: 'oauth-callback',
      component: OauthCallbackView,
    },
  ],
})

export default router
