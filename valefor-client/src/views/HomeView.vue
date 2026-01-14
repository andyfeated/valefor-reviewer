<script setup lang="ts">
import {
  ClockIcon,
  ArrowRightIcon,
  XIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
} from 'lucide-vue-next'
import Navbar from '@/components/Navbar.vue'
import { motion } from 'motion-v'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'

const router = useRouter()

const prUrl = ref<string>('')
const isAnalyzing = ref<boolean>(false)

const reviews = ref<any>([])
const totalCount = ref<number>(0)
const totalPages = computed(() => Math.ceil(totalCount.value / defaultPageSize))

const currentPage = ref(1)
const defaultPageSize = 3

const timeAgo = (dateString: string | Date) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()

  const diffSeconds = Math.floor(diffMs / 1000)
  const diffMinutes = Math.floor(diffSeconds / 60)
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  if (diffMinutes > 0) return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`
  return 'Just now'
}

const suggestionsCount = (diffs: any[]) => {
  const validDiffs = diffs.filter((d) => d.isValid)
  return validDiffs.length
}

const fetchReviews = async (page = 1, pageSize = defaultPageSize) => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_BASE_API_URL}/review?page=${page}&pageSize=${pageSize}`,
      {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      },
    )

    if (!res.ok) {
      const errorData = await res.json()
      throw new Error(errorData?.message || errorData?.error || 'An error occured')
    }

    const data = await res.json()

    currentPage.value = page
    reviews.value = data.items
    totalCount.value = data.totalCount
  } catch (err: any) {
    console.error(err)
    toast.error(err.message)
  }
}

const deleteReview = async (id: string) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_BASE_API_URL}/review/${id}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    })

    if (!res.ok) {
      const errorData = await res.json()
      throw new Error(errorData?.message || errorData?.error || 'An error occured')
    }

    toast.success('Review deleted successfully')

    await fetchReviews(1, defaultPageSize)
  } catch (err: any) {
    console.error(err)
    toast.error(err.message)
  }
}

const pushToReview = (id: string) => {
  router.push(`/review/${id}`)
}

onMounted(async () => {
  await fetchReviews(currentPage.value, defaultPageSize)
})

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
  } catch (err: any) {
    console.error(err)
    toast.error(err.message)
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
          Paste a GitHub or GitLab URL to recieve code review suggestions
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
              placeholder="https://gitlab.com/microsoft/vscode/-/merge_requests/1234"
              class="w-full px-4 py-4 bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-primary)] focus:border-blue-500/50 outline-none font-mono text-sm"
              :disabled="isAnalyzing"
              v-model="prUrl"
            />
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
          v-if="!reviews.length"
          :initial="{ opacity: 0, y: 10 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.3 }"
          class="py-12 text-center"
        >
          <motion.div
            :initial="{ scale: 0.9, opacity: 0 }"
            :animate="{ scale: 1, opacity: 1 }"
            :transition="{ delay: 0.1, duration: 0.4 }"
            class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--color-bg-secondary)] border border-[var(--color-border)] mb-4"
          >
            <ClockIcon class="w-7 h-7 text-[var(--color-text-dim)]" />
          </motion.div>
          <motion.h4
            :initial="{
              opacity: 0,
              y: 5,
            }"
            :animate="{
              opacity: 1,
              y: 0,
            }"
            :transition="{
              delay: 0.2,
              duration: 0.3,
            }"
            className="text-base font-medium text-[var(--color-text-primary)] mb-2"
          >
            No recent reviews
          </motion.h4>
          <motion.p
            :initial="{
              opacity: 0,
              y: 5,
            }"
            :animate="{
              opacity: 1,
              y: 0,
            }"
            :transition="{
              delay: 0.3,
              duration: 0.3,
            }"
            className="text-sm text-[var(--color-text-dim)] max-w-xs mx-auto"
          >
            Your reviewed pull requests will appear here
          </motion.p>
        </motion.div>

        <motion.div
          v-for="(item, index) in reviews"
          :key="item.id"
          :initial="{ x: -20, opacity: 0 }"
          :animate="{ x: 0, opacity: 1 }"
          :transition="{ duration: 0.5, delay: 0.1 + index * 0.05, ease: [0.22, 1, 0.36, 1] }"
          class="group flex items-stretch"
        >
          <button
            class="cursor-pointer flex-1 flex items-center justify-between mb-3 p-4 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-l-lg border-r-0 hover:border-[var(--color-border-bright)] hover:bg-[var(--color-bg-tertiary)] text-left group/read"
            @click="pushToReview(item.id)"
          >
            <div class="flex-1 min-w-0">
              <p
                class="text-sm font-mono text-[var(--color-text-primary)] group-hover:text-blue-400"
              >
                {{ item.pullRequestUrl }}
              </p>

              <p class="text-xs text-[var(--color-text-dim)] mt-2">{{ timeAgo(item.createdAt) }}</p>
            </div>

            <div class="flex items-center gap-3">
              <span class="text-sm text-[var(--color-text-secondary)]">
                {{ suggestionsCount(item.diffs) }} suggestions
              </span>
            </div>

            <ArrowRightIcon
              class="w-4 h-4 text-[var(--color-text-dim)] group-hover/read:text-blue-400 ml-3"
            />
          </button>

          <button
            class="cursor-pointer flex items-center justify-center w-12 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-r-lg hover:border-rose-500/50 hover:bg-rose-500/5 transition-all group/delete mb-3"
            @click="deleteReview(item.id)"
          >
            <XIcon
              class="w-4 h-4 text-[var(--color-text-dim)] group-hover/delete:text-rose-400 transition-colors"
            />
          </button>
        </motion.div>

        <motion.div
          :initial="{ opacity: 0 }"
          :animate="{ opacity: 1 }"
          :transition="{ delay: 0.3 }"
          v-if="reviews.length > 0"
          class="flex items-center justify-between px-2"
        >
          <span class="text-xs text-[var(--color-text-dim)]"
            >Page {{ currentPage }} of {{ totalPages }}</span
          >

          <div class="flex items-center gap-1">
            <button
              class="cursor-pointer p-1.5 rounded-md text-[var(--color-text-dim)] hover:text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Previous page"
              :disabled="currentPage === 1"
              @click="fetchReviews(currentPage - 1, defaultPageSize)"
            >
              <ChevronLeftIcon class="w-4 h-4" />
            </button>

            <button
              class="cursor-pointer p-1.5 rounded-md text-[var(--color-text-dim)] hover:text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Next page"
              :disabled="currentPage === totalPages"
              @click="fetchReviews(currentPage + 1, defaultPageSize)"
            >
              <ChevronRightIcon class="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  </div>
</template>

<style></style>
