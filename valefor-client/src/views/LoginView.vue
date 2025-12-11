<script setup lang="ts">
import { motion } from 'motion-v'
import { SparklesIcon, GithubIcon, GitlabIcon, ArrowRightIcon } from 'lucide-vue-next'
import OAuthService, { type ProviderName } from '../utils/OAuthService.ts'

const items = Array.from({ length: 6 }, (_, i) => i)

async function loginWithOauth(provider: ProviderName) {
  const oauthService = new OAuthService()

  const oauthUrl = await oauthService.buildOauthUrl(provider)
  window.location.href = oauthUrl
}
</script>

<template>
  <div
    class="min-h-screen overflow-hidden text-white bg-[#0a0a0a] flex items-center justify-center relative"
  >
    <div class="absolute inset-0">
      <motion.div
        class="absolute top-1/4 -left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl"
        :animate="{ scale: [1, 2.5, 1], opacity: [0.3, 0.5, 0.3] }"
        :transition="{ duration: 8, repeat: Infinity, ease: 'easeInOut' }"
      />

      <motion.div
        class="absolute top-1/4 -right-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl"
        :animate="{ scale: [1, 2.5, 1], opacity: [0.3, 0.5, 0.3] }"
        :transition="{ duration: 8, repeat: Infinity, ease: 'easeInOut' }"
      />

      <motion.div
        v-for="item in items"
        :key="item"
        class="w-1 h-1 rounded-full absolute bg-blue-500"
        :style="{ top: `${230 + (item % 3) * 250}px`, left: `${270 + item * 220}px` }"
        :animate="{ y: [0, -30, 0], opacity: [0.2, 0.5, 0.2], scale: [1, 1.8, 1] }"
        :transition="{
          duration: 3 + item * 0.5,
          repeat: Infinity,
          delay: item * 0.3,
          ease: 'easeInOut',
        }"
      />
    </div>

    <div class="w-full max-w-md relative">
      <motion.div
        :initial="{ y: -20, opacity: 0 }"
        :animate="{ y: 0, opacity: 1 }"
        :transition="{ duration: 0.6, ease: 'easeOut' }"
        class="text-center mb-8"
      >
        <motion.div
          :animate="{ rotate: [0, 7, -7, 0] }"
          :transition="{ duration: 4, repeat: Infinity, ease: 'easeInOut' }"
          class="inline-flex items-center justify-center mb-6 w-16 h-16 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 rounded-2xl shadow-2xl shadow-blue-600/40 relative"
        >
          <SparklesIcon class="w-8 h-8 text-white" />
          <motion.div
            :animate="{ scale: [1, 1.2, 1], opacity: [0.4, 0, 0.4] }"
            :transition="{ duration: 3, repeat: Infinity, ease: 'easeOut' }"
            class="absolute inset-0 bg-blue-400 rounded-2xl blur-xl"
          />
        </motion.div>

        <motion.h1
          :initial="{ y: 20, opacity: 0 }"
          :animate="{ y: 0, opacity: 1 }"
          :transition="{ duration: 0.6, delay: 0.15, ease: [0.3, 1, 0.4, 1] }"
          class="text-4xl font-bold mb-4 text-[#e8e8e8]"
        >
          Valefor AI Reviewer
        </motion.h1>

        <motion.p
          :initial="{ y: 20, opacity: 0 }"
          :animate="{ y: 0, opacity: 1 }"
          :transition="{ duration: 0.6, delay: 0.2, ease: [0.3, 1, 0.4, 1] }"
          class="text-[#a8a8a8]"
        >
          One-click PR reviews, Paste any URL, get instant AI feedback.
        </motion.p>
      </motion.div>

      <motion.div
        :initial="{ y: 20, opacity: 0 }"
        :animate="{ y: 0, opacity: 1 }"
        :transition="{ duration: 0.6, delay: 0.25, ease: [0.3, 1, 0.4, 1] }"
        class="space-y-4 mb-8"
      >
        <motion.button
          :while-hover="{ scale: 1.03 }"
          :while-press="{ scale: 0.95 }"
          class="relative w-full cursor-pointer flex items-center gap-3 px-4 py-4 bg-[#141414] border border-[#2a2a2a] hover:border-blue-500/50 rounded-xl text-[#e8e8e8] font-medium transition-all overflow-hidden"
        >
          <motion.div
            :animate="{ x: ['-100%', '100%'] }"
            :transition="{ duration: 3, repeat: Infinity, ease: 'linear' }"
            class="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent"
          />
          <GithubIcon class="w-5 h-5" />
          <span class="flex-1 text-left">Continue with Github</span>
          <ArrowRightIcon class="w-4 h-4 text-[#6a6a6a] mr-1" />
        </motion.button>

        <motion.button
          @click="loginWithOauth('gitlab')"
          :while-hover="{ scale: 1.03 }"
          :while-press="{ scale: 0.95 }"
          class="relative w-full cursor-pointer flex items-center gap-3 px-4 py-4 bg-[#141414] border border-[#2a2a2a] hover:border-blue-500/50 rounded-xl text-[#e8e8e8] font-medium transition-all overflow-hidden"
        >
          <motion.div
            :animate="{ x: ['-100%', '100%'] }"
            :transition="{ duration: 3, repeat: Infinity, ease: 'linear', delay: 1 }"
            class="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent"
          />
          <GitlabIcon class="w-5 h-5" />
          <span class="flex-1 text-left">Continue with Gitlab</span>
          <ArrowRightIcon class="w-4 h-4 text-[#6a6a6a] mr-1" />
        </motion.button>
      </motion.div>

      <motion.div
        :initial="{ y: 20, opacity: 0 }"
        :animate="{ y: 0, opacity: 1 }"
        :transition="{ duration: 0.6, delay: 0.3, ease: [0.3, 1, 0.4, 1] }"
        class="text-center text-[#6a6a6a]"
      >
        <p>Secure OAuth • Limited scope • Read-only access</p>
      </motion.div>
    </div>
  </div>
</template>

<style></style>
