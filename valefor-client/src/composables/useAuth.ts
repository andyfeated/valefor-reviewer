import { ref } from 'vue'

type User = {
  id: number
  email: string
  name: string
}

const user = ref<User | null>(null)
const isAuthenticated = ref(false)

export function useAuth() {
  async function oauthLogin(code: string, state: string) {
    const { provider } = JSON.parse(atob(state))
    const codeVerifer = localStorage.getItem(`${provider}_code_verifier`)

    const res = await fetch(`${import.meta.env.VITE_BASE_API_URL}/auth/oauth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, state, code_verifier: codeVerifer }),
      credentials: 'include',
    })

    if (!res.ok) {
      throw new Error('OAuth login failed')
    }

    const data = await res.json()

    localStorage.removeItem(`${provider}_code_verifier`)

    user.value = data
    isAuthenticated.value = true
  }

  async function checkAuth() {
    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_API_URL}/auth/my-profile`, {
        credentials: 'include',
      })

      if (!res.ok) {
        throw new Error('Error occured')
      }

      const data = await res.json()

      user.value = data
      isAuthenticated.value = true
    } catch (err) {
      user.value = null
      isAuthenticated.value = false
    }
  }

  return { oauthLogin, checkAuth, user, isAuthenticated }
}
