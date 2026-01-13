<script setup>
import { motion } from 'motion-v'
import { RefreshCwIcon, SparklesIcon, ArrowLeftIcon, Loader2Icon } from 'lucide-vue-next'
import ProfileDropdown from './ProfileDropdown.vue'
import { useRouter } from 'vue-router'
import { computed } from 'vue'

const router = useRouter()

const props = defineProps({
  displayPrInfo: {
    type: Boolean,
    required: false,
    default: false,
  },
  review: {
    type: Object,
    required: false,
    default: {},
  },
})

const returnToHome = () => {
  router.push('/')
}

const criticalCount = computed(
  () => props.review.diffs.filter((d) => d?.criticalityLevel === 'critical')?.length || 0,
)
const majorCount = computed(
  () => props.review.diffs.filter((d) => d?.criticalityLevel === 'major')?.length || 0,
)
const minorCount = computed(
  () => props.review.diffs.filter((d) => d?.criticalityLevel === 'minor')?.length || 0,
)
const passedCount = computed(
  () => props.review.diffs.filter((d) => d?.criticalityLevel === 'passed')?.length || 0,
)
</script>

<template>
  <div class="border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-8 py-6">
    <div class="max-w-7xl mx-auto">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg">
            <SparklesIcon class="w-5 h-5 text-white" />
          </div>

          <h1 class="text-2xl font-bold text-white">Valefor AI Reviewer</h1>
        </div>
        <ProfileDropdown />
      </div>

      <div v-if="props.displayPrInfo">
        <div class="flex justify-between mt-4 items-center">
          <button
            @click="returnToHome()"
            class="mb-3 flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors group cursor-pointer"
          >
            <ArrowLeftIcon class="w-4 h-4" />
            <span>Back to input</span>
          </button>

          <button
            class="flex gap-2 flex items-center px-4 py-2 bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] text-[var(--color-text-secondary)] font-medium rounded-lg hover:bg-[var(--color-primary)] hover:border-[var(--color-border-bright)] transition-colors"
          >
            <RefreshCwIcon class="w-4 h-4" />
            Pull latest changes
          </button>
        </div>

        <div
          v-if="!props.review"
          class="w-90 h-4 bg-[var(--color-text-dim)] rounded-full animate-pulse opacity-65"
        />
        <p v-else class="text-sm text-[var(--color-text-secondary)] font-mono mb-1">
          {{ props.review.pullRequestUrl }}
        </p>

        <div
          v-if="!props.review"
          class="mt-3 w-140 h-4 bg-[var(--color-text-dim)] rounded-full animate-pulse opacity-65"
        />
        <div v-else class="mt-3 flex items-center gap-3 text-sm text-[var(--color-text-dim)]">
          <span>{{ props.review.diffs.length }} file changes</span>

          <span>•</span>
          <motion.div
            v-if="props.review.status === 'pending'"
            :animate="{ rotate: 360 }"
            :transition="{ duration: 1, repeat: Infinity, ease: 'linear' }"
            class="mr-[-5px]"
          >
            <Loader2Icon class="text-rose-400 w-3.5 h-3.5" />
          </motion.div>
          <span class="text-rose-400">{{ criticalCount }} critical</span>

          <span>•</span>
          <motion.div
            v-if="props.review.status === 'pending'"
            :animate="{ rotate: 360 }"
            :transition="{ duration: 1, repeat: Infinity, ease: 'linear' }"
            class="mr-[-5px]"
          >
            <Loader2Icon class="text-orange-400 w-3.5 h-3.5" />
          </motion.div>
          <span class="text-orange-400">{{ majorCount }} major</span>

          <span>•</span>
          <motion.div
            v-if="props.review.status === 'pending'"
            :animate="{ rotate: 360 }"
            :transition="{ duration: 1, repeat: Infinity, ease: 'linear' }"
            class="mr-[-5px]"
          >
            <Loader2Icon class="text-amber-400 w-3.5 h-3.5" />
          </motion.div>
          <span class="text-amber-400">{{ minorCount }} minor</span>

          <span>•</span>
          <motion.div
            v-if="props.review.status === 'pending'"
            :animate="{ rotate: 360 }"
            :transition="{ duration: 1, repeat: Infinity, ease: 'linear' }"
            class="mr-[-5px]"
          >
            <Loader2Icon class="text-emerald-400 w-3.5 h-3.5" />
          </motion.div>
          <span class="text-emerald-400">{{ passedCount }} passed</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style></style>
