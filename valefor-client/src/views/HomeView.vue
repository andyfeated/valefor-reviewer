<script setup lang="ts">
import { ClockIcon, ArrowRightIcon, GitlabIcon, GithubIcon } from 'lucide-vue-next'
import Navbar from '@/components/Navbar.vue'
import { motion } from 'motion-v'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const prUrl = ref<string>(
  'https://gitlab.com/theoria-medical/se/tm-institute-server/-/merge_requests/173',
)
const isAnalyzing = ref<boolean>(false)

const recentReviews = [
  { url: 'github.com/vercel/next.js/pull/1201', time: '2 hours ago', suggestions: 8 },
  { url: 'gitlab.com/microsoft/vscode/pull/84523', time: '8 hours ago', suggestions: 2 },
  { url: 'github.com/netflix/next.js/pull/4123', time: '2 hours ago', suggestions: 8 },
  { url: 'gitlab.com/google/vscode/pull/12314', time: '8 hours ago', suggestions: 2 },
]

const submit = async (e: Event) => {
  try {
    e.preventDefault()

    isAnalyzing.value = true

    const url = new URL(prUrl.value)
    const provider = url.host.replace('.com', '')

    const res = await fetch(`${import.meta.env.VITE_BASE_API_URL}/review/${provider}`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prUrl: prUrl.value }),
    })

    if (!res.ok) {
      const errorData = await res.json()
      throw new Error(errorData?.message || errorData?.error || 'An error occured')
    }

    const review = await res.json()
    router.push(`/review/${review.id}`)
  } catch (err) {
    console.error(err)
  }

  isAnalyzing.value = false
}
</script>

<template>
  <div class="min-h-screen bg-[var(--color-bg-primary)]">
    <Navbar />

    <div class="max-w-4xl mx-auto px-8 py-16">
      <motion.div
        :initial="{ y: 20, opacity: 0 }"
        :animate="{ y: 0, opacity: 1 }"
        :transition="{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }"
        class="mb-8"
      >
        <h2 class="text-3xl font-bold text-white mb-3 text-center">
          Get instant AI feedback on your pull requests
        </h2>
        <p class="text-[var(--color-text-secondary)] text-center">
          Paste a GitHub or GitLab URL to recieve intelligent code review suggestions
        </p>
      </motion.div>

      <motion.form
        :initial="{ y: 20, opacity: 0 }"
        :animate="{ y: 0, opacity: 1 }"
        :transition="{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }"
        class="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl p-7 mb-12"
        @submit="submit"
      >
        <label class="block text-sm font-medium text-[var(--color-text-secondary)] mb-3">
          Pull Request URL
        </label>

        <div class="flex items-center gap-3">
          <div class="flex-1 relative">
            <input
              type="url"
              required
              placeholder="https://github.com/facebook/react/pull/28813"
              class="w-full px-4 py-4 bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-primary)] focus:border-blue-500/50 outline-none font-mono text-sm"
              :disabled="isAnalyzing"
              v-model="prUrl"
            />

            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
              <GithubIcon class="w-5 h-5 text-[var(--color-text-dim)]" />
              <GitlabIcon class="w-5 h-5 text-[var(--color-text-dim)]" />
            </div>
          </div>

          <button
            type="submit"
            :disabled="isAnalyzing"
            class="px-8 py-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all items-center gap-2 cursor-pointer"
          >
            <div v-if="isAnalyzing" class="flex gap-2">
              Analyzing
              <motion.div
                :animate="{ rotate: 360 }"
                :transition="{ duration: 1, repeat: Infinity }"
                class="w-5 h-5 border-3 border-white border-t-transparent rounded-full"
              />
            </div>
            <div v-else class="flex gap-3 items-center">
              Analyze <ArrowRightIcon class="w-5 h-5" />
            </div>
          </button>
        </div>

        <p class="mt-4 text-sm text-[var(--color-text-dim)]">
          Supports public and private repositories accessible by your connected account
        </p>
      </motion.form>

      <motion.div
        :initial="{ y: 20, opacity: 0 }"
        :animate="{ y: 0, opacity: 1 }"
        :transition="{
          duration: 0.5,
          delay: 0.2,
          ease: [0.22, 1, 0.36, 1],
        }"
      >
        <div class="flex items-center gap-2 mb-4">
          <ClockIcon class="w-4 h-4 text-[var(--color-text-dim)]" />
          <h3 class="font-semibold text-sm text-[var(--color-text-secondary)]">Recent Reviews</h3>
        </div>

        <motion.div
          v-for="(item, index) in recentReviews"
          :key="item.url"
          :initial="{ x: -20, opacity: 0 }"
          :animate="{ x: 0, opacity: 1 }"
          :transition="{ duration: 0.5, delay: 0.3 + index * 0.05, ease: [0.22, 1, 0.36, 1] }"
          class="cursor-pointer w-full flex items-center justify-between mb-3 p-4 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg hover:border-[var(--color-border-bright)] hover:bg-[var(--color-bg-tertiary)] text-left group"
        >
          <div class="flex-1 min-w-0">
            <p class="text-sm font-mono text-[var(--color-text-primary)] group-hover:text-blue-400">
              {{ item.url }}
            </p>
            <p class="text-xs text-[var(--color-text-dim)] mt-2">{{ item.time }}</p>
          </div>

          <div class="flex items-center gap-3">
            <span class="text-sm text-[var(--color-text-secondary)]"
              >{{ item.suggestions }} suggestions
            </span>
          </div>

          <ArrowRightIcon
            class="w-4 h-4 text-[var(--color-text-dim)] group-hover:text-blue-400 ml-3"
          />
        </motion.div>
      </motion.div>
    </div>
  </div>
</template>

<style></style>
