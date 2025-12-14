<script setup lang="ts">
import { SparklesIcon, ArrowRightIcon, GitlabIcon, GithubIcon } from 'lucide-vue-next'
import ProfileDropdown from '../components/ProfileDropdown.vue'
import { motion } from 'motion-v'
import { ref } from 'vue'

const prUrl = ref<string>('http://localhost:4000')
const isAnalyzing = ref<boolean>(false)

const submit = async (e: Event) => {
  e.preventDefault()

  isAnalyzing.value = true
  await new Promise((res) => setTimeout(res, 2000))
  isAnalyzing.value = false
}
</script>

<template>
  <div class="min-h-screen bg-[var(--color-bg-primary)]">
    <div class="border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-8 py-6">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg">
            <SparklesIcon class="w-5 h-5 text-white" />
          </div>

          <h1 class="text-2xl font-bold text-white">Valefor AI Reviewer</h1>
        </div>
        <ProfileDropdown />
      </div>
    </div>

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

        <div class="flex gap-3">
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
            <div v-else class="flex gap-2">Analyze <ArrowRightIcon class="w-5 h-5" /></div>
          </button>
        </div>

        <p class="mt-4 text-sm text-[var(--color-text-dim)]">
          Supports public and private repositories accessible by your connected account
        </p>
      </motion.form>
    </div>
  </div>
</template>

<style></style>
