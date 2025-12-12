<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const { oauthLogin } = useAuth()

onMounted(async () => {
  const { code, state } = route.query

  if (!code || !state || Array.isArray(code) || Array.isArray(state)) {
    return
  }

  try {
    await oauthLogin(code, state)
    router.push('/')
  } catch (err) {
    router.push('/login')
  }
})
</script>

<template>
  <p>Oauth x</p>
</template>

<style></style>
