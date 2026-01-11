<script setup>
import { computed } from 'vue'
import { motion } from 'motion-v'
import { ChevronRightIcon, FolderIcon, FileIcon } from 'lucide-vue-next'
import { AnimatePresence } from 'motion-v'

const props = defineProps({
  node: {
    type: Object,
  },
  depth: { type: Number },
  collapsedFolders: { type: Set },
  selectedFile: { type: String },
})

const paddingLeft = computed(() => `${props.depth * 16 + 12}px`)
const isExpanded = computed(() => !props.collapsedFolders.has(props.node.path))
</script>

<template>
  <div>
    <template v-if="props.node?.type === 'folder'">
      <button
        class="flex items-center gap-2 w-full px-3 py-2 hover:bg-[var(--color-bg-tertiary)] cursor-pointer rounded-lg transition-colors text-left"
        :style="{ paddingLeft }"
      >
        <motion.div
          :animate="{ rotate: isExpanded ? 90 : 0 }"
          :transition="{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }"
        >
          <ChevronRightIcon class="w-4 h-4 text-[var(--color-text-dim)]" />
        </motion.div>

        <FolderIcon class="w-4 h-4 text-amber-400" />
        <span class="text-sm text-[var(--color-text-secondary)]">{{ node?.name }}</span>
      </button>

      <AnimatePresence>
        <motion.div>
          <FileTreeNode
            v-for="child in props.node.children"
            :key="child.path"
            :node="child"
            :depth="depth + 1"
            :collapsedFolders="collapsedFolders"
          />
        </motion.div>
      </AnimatePresence>
    </template>

    <template v-else>
      <button
        class="cursor-pointer flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-left hover:bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)]"
        :style="{ paddingLeft: `${depth * 16 + 28}px` }"
      >
        <FileIcon class="w-4 h-4" />
        <span class="text-sm font-mono">{{ props.node.name }}</span>
      </button>
    </template>
  </div>
</template>
