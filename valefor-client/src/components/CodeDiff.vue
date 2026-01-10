<script setup>
import { ChevronDownIcon } from 'lucide-vue-next'
import { motion } from 'motion-v'
import { computed } from 'vue'

const props = defineProps({
  diff: {
    type: Object,
    default: () => ({
      concerns: [],
    }),
  },
  isExpanded: {
    type: Boolean,
    default: false,
  },
})

const emits = defineEmits(['toggle-collapse'])

const safeConcerns = computed(() => props.diff?.concerns ?? [])
</script>

<template>
  <div
    :key="props.diff.path"
    :id="`file-${props.diff.path}`"
    class="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl overflow-hidden"
  >
    <button
      class="w-full px-6 py-4 bg-[var(--color-bg-tertiary)] border-b border-[var(--color-border)] flex items-center justify-between hover:bg-[var(--color-bg-secondary)] transition-colors cursor-pointer"
      @click="$emit('toggle-collapse')"
    >
      <div class="flex items-center gap-3">
        <span class="font-mono text-sm text-[var(--color-text-primary)]">
          {{ props.diff.path }}
        </span>
        <span
          v-if="!safeConcerns.length"
          class="px-2 py-0.5 bg-blue-500/10 border border-blue-500/30 rounded-full text-xs font-medium text-blue-400"
        >
          {{ safeConcerns.length }} suggestion(s)
        </span>
      </div>

      <motion.div :animate="{ rotate: isExpanded ? 180 : 0 }" :transition="{ duration: 0.2 }">
        <ChevronDownIcon class="w-5 h-5 text-[var(--color-text-dim)]" />
      </motion.div>
    </button>
  </div>
</template>
