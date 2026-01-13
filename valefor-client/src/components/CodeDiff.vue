<script setup>
import { ChevronDownIcon, Loader2Icon, SparklesIcon } from 'lucide-vue-next'
import { motion, AnimatePresence } from 'motion-v'
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
  status: {
    type: String,
  },
})

const criticalityColorMap = {
  critical: 'rose',
  major: 'orange',
  minor: 'amber',
  passed: 'emerald',
}

const emits = defineEmits(['toggle-collapse'])

const styles = {
  added: {
    bg: 'bg-emerald-500/5',
    border: 'border-l-2 border-emerald-500/40',
    text: 'text-emerald-400',
    prefix: '+',
  },
  removed: {
    bg: 'bg-rose-500/5',
    border: 'border-l-2 border-rose-500/40',
    text: 'text-rose-400',
    prefix: '-',
  },
  context: {
    bg: 'bg-transparent',
    border: 'border-l-2 border-transparent',
    text: 'text-[var(--color-text-primary)]',
    prefix: ' ',
  },
  hunk: {
    bg: 'bg-transparent',
    border: 'border-l-2 border-transparent',
    text: 'text-[var(--color-text-primary)]',
    prefix: ' ',
  },
}

const formatConcern = (text) => {
  return text.replace(
    /`([^`]+)`/g,
    '<code class="px-1.5 py-0.5 bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] rounded text-xs font-mono text-[var(--color-text-primary)]">$1</code>',
  )
}

const styleFor = (type) => styles[type]

const parseDiff = (diff) => {
  if (!diff) {
    return {}
  }

  const lines = diff.split('\n')
  const result = []

  let oldLineNum = 0
  let newLineNum = 0

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const hunkMatch = line.match(/^@@ -(\d+),\d+ \+(\d+),\d+ @@/)

    if (hunkMatch) {
      result.push({
        type: 'hunk',
        content: line,
        lineNumber: null,
      })

      oldLineNum = parseInt(hunkMatch[1])
      newLineNum = parseInt(hunkMatch[2])

      continue
    }

    if (line.startsWith('---') || line.startsWith('+++')) continue

    let type = 'context'
    let lineNumber = newLineNum

    if (line.startsWith('+')) {
      type = 'added'
      lineNumber = newLineNum
      newLineNum++
    } else if (line.startsWith('-')) {
      type = 'removed'
      lineNumber = oldLineNum
      oldLineNum++
    } else {
      lineNumber = oldLineNum
      oldLineNum++
      newLineNum++
    }

    const content = line.startsWith('+') || line.startsWith('-') ? line.slice(1) : line

    result.push({
      lineNumber,
      content,
      type,
    })
  }

  return result
}

const lines = computed(() => parseDiff(props.diff.diff))
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
          v-if="props.status === 'pending'"
          class="px-2 py-0.5 bg-blue-500/10 border border-blue-500/30 rounded-full text-xs font-medium text-blue-400 flex items-center gap-1"
        >
          <motion.div
            :animate="{ rotate: 360 }"
            :transition="{ duration: 1, repeat: Infinity, ease: 'linear' }"
          >
            <Loader2Icon class="w-3.5 h-3.5" />
          </motion.div>
          <span>Analyzing</span>
        </span>

        <span
          v-else-if="!props.diff?.isValid"
          class="px-2 py-0.5 bg-yellow-500/10 border border-yellow-500/30 rounded-full text-xs font-medium text-yellow-400"
        >
          Skipped
        </span>

        <span
          v-else-if="props.diff.criticalityLevel === 'passed'"
          class="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-xs font-medium text-emerald-400"
        >
          Passed
        </span>

        <span
          v-else-if="props.diff.criticalityLevel === 'critical'"
          class="px-2 py-0.5 bg-rose-500/10 border border-rose-500/30 rounded-full text-xs font-medium text-rose-400"
        >
          Critical
        </span>

        <span
          v-else-if="props.diff.criticalityLevel === 'major'"
          class="px-2 py-0.5 bg-orange-500/10 border border-orange-500/30 rounded-full text-xs font-medium text-orange-400"
        >
          Major
        </span>

        <span
          v-else-if="props.diff.criticalityLevel === 'minor'"
          class="px-2 py-0.5 bg-amber-500/10 border border-amber-500/30 rounded-full text-xs font-medium text-amber-400"
        >
          Minor
        </span>
      </div>

      <motion.div :animate="{ rotate: isExpanded ? 180 : 0 }" :transition="{ duration: 0.2 }">
        <ChevronDownIcon class="w-5 h-5 text-[var(--color-text-dim)]" />
      </motion.div>
    </button>

    <AnimatePresence>
      <motion.div
        v-if="isExpanded"
        :initial="{ height: 0, opacity: 0 }"
        :animate="{ height: 'auto', opacity: 1 }"
        :exit="{ height: 0, opacity: 0 }"
        :transition="{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }"
        class="overflow-hidden"
      >
        <div
          className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl overflow-hidden text-white"
        >
          <div class="font-mono text-sm overflow-auto">
            <div class="inline-block min-w-full">
              <div
                v-for="line of lines"
                :key="line.id"
                class="flex items-center group max-w-7xl transition-colors hover:bg-[var(--color-bg-tertiary)]"
                :class="[styleFor(line.type).bg, styleFor(line.type).border]"
              >
                <div
                  v-if="line.type === 'hunk'"
                  class="px-4 py-2 bg-[var(--color-bg-tertiary)] border-b border-[var(--color-border)] w-full"
                >
                  <span className="text-xs text-[var(--color-text-dim)] font-medium">
                    {{ line.content }}
                  </span>
                </div>

                <div v-else class="flex">
                  <div
                    class="w-16 px-3 py-2 text-xs text-right select-none text-[var(--color-text-dim)] border-r border-[var(--color-border)]"
                  >
                    {{ line.lineNumber }}
                  </div>

                  <div
                    class="w-8 px-2 py-2 text-xs text-center select-none text-[var(--color-text-dim)] border-r border-[var(--color-border)]"
                  >
                    {{ styleFor(line.type).prefix }}
                  </div>

                  <div class="whitespace-pre flex-1 px-4 py-2" :class="styleFor(line.type).text">
                    {{ line.content }}
                  </div>
                </div>
              </div>
            </div>

            <div v-if="!props.diff.isValid" class="px-5 pb-5 text-[var(--color-text-dim)]">
              <p>File was skipped:</p>
              <p>Skip reason: {{ props.diff.validationReason }}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>

    <div v-if="props?.diff?.concerns?.length" class="p-7 bg-[var(--color-bg-primary)]">
      <div class="flex items-center gap-2 mb-4">
        <SparklesIcon class="w-4 h-4 text-blue-400" />
        <h3 class="text-sm font-semibold text-[var(--color-text-primary)]">AI Suggestions</h3>
      </div>

      <ul class="space-y-2">
        <motion.li
          v-for="concern in props.diff.concerns"
          class="flex items-start gap-3 pl-3 py-2 border-l-2"
          :class="`border-${criticalityColorMap[props.diff.criticalityLevel]}-500/30`"
        >
          <span v-if="props.diff.criticalityLevel === 'critical'" :class="`text-rose-400/70`">
            •
          </span>

          <span v-if="props.diff.criticalityLevel === 'major'" :class="`text-orange-400/70`">
            •
          </span>

          <span v-if="props.diff.criticalityLevel === 'minor'" :class="`text-amber-400/70`">
            •
          </span>

          <span v-if="props.diff.criticalityLevel === 'passed'" :class="`text-emerald-400/70`">
            •
          </span>

          <span
            class="text-sm text-[var(--color-text-secondary)] leading-relaxed flex-1"
            v-html="formatConcern(concern)"
          >
          </span>
        </motion.li>
      </ul>
    </div>
  </div>
</template>
