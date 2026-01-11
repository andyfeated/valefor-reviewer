<script setup>
import { computed } from 'vue'
import { motion } from 'motion-v'
import { ChevronDownIcon, FolderIcon, FileIcon } from 'lucide-vue-next'
import { AnimatePresence } from 'motion-v'

const props = defineProps({
  node: {
    type: Object,
  },
  depth: { type: Number },
  collapsedFolders: { type: Set },
  selectedFile: { type: String },
})

const emit = defineEmits(['toggleFolder', 'selectFile'])

const paddingLeft = computed(() => `${props.depth * 16 + 12}px`)
const isCollapsed = computed(() => props.collapsedFolders.has(props.node.path))
const isSelected = computed(() => props.selectedFile === props.node.path)

const displayName = computed(() => {
  const name = props.node.name
  const baseLength = 20
  const depthPenalty = props.depth * 2
  const maxLength = Math.max(baseLength - depthPenalty, 22)

  if (name.length <= maxLength) return name

  const keepLength = Math.floor((maxLength - 3) / 2)
  const start = name.slice(0, keepLength)
  const end = name.slice(name.length - keepLength)
  return `${start}...${end}`
})
</script>

<template>
  <div>
    <template v-if="props.node?.type === 'folder'">
      <button
        class="flex items-center gap-2 w-full px-3 py-2 hover:bg-[var(--color-bg-tertiary)] cursor-pointer rounded-lg transition-colors text-left"
        :style="{ paddingLeft }"
        @click="$emit('toggleFolder', props.node.path)"
      >
        <motion.div
          :animate="{ rotate: isCollapsed ? -90 : 0 }"
          :transition="{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }"
        >
          <ChevronDownIcon class="w-4 h-4 text-[var(--color-text-dim)]" />
        </motion.div>

        <FolderIcon class="w-4 h-4 text-amber-400" />
        <span class="text-sm text-[var(--color-text-secondary)]">{{ displayName }}</span>
      </button>

      <AnimatePresence>
        <motion.div
          v-if="!isCollapsed"
          :initial="{ height: 0, opacity: 0 }"
          :animate="{ height: 'auto', opacity: 1 }"
          :exit="{ height: 0, opacity: 0 }"
          :transition="{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }"
          class="overflow-hidden"
        >
          <FileTreeNode
            v-for="child in props.node.children"
            :key="child.path"
            :node="child"
            :depth="depth + 1"
            :collapsedFolders="collapsedFolders"
            :selectedFile="selectedFile"
            @toggleFolder="$emit('toggleFolder', $event)"
            @selectFile="$emit('selectFile', $event)"
          />
        </motion.div>
      </AnimatePresence>
    </template>

    <template v-else>
      <button
        class="cursor-pointer w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-left"
        :class="
          isSelected
            ? 'bg-[var(--color-bg-tertiary)] text-white font-medium'
            : 'hover:bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)]'
        "
        :style="{ paddingLeft: `${depth * 16 + 28}px` }"
        @click="emit('selectFile', props.node.path)"
      >
        <FileIcon class="w-4 h-4" />
        <span class="text-sm font-mono">{{ displayName }}</span>
      </button>
    </template>
  </div>
</template>
