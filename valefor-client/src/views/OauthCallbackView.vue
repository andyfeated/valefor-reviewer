<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

onMounted(async () => {
  const { code, state } = route.query

  if (!code || !state || Array.isArray(code) || Array.isArray(state)) {
    console.error('No code or state provided')
    return
  }

  const { provider } = JSON.parse(atob(state))
  const codeVerifer = localStorage.getItem(`${provider}_code_verifier`)

  const res = await fetch(`${import.meta.env.VITE_BASE_API_URL}/auth/oauth/exchange`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, state, code_verifier: codeVerifer }),
  })
})
</script>

<template>
  <p>Oauth x</p>
</template>

<style></style>
