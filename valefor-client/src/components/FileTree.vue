<script setup>
import { ref, computed } from 'vue'
import FileTreeNode from '@/components/FileTreeNode.vue'

const props = defineProps({
  diffs: {
    type: Array,
    default: [],
  },
  selectedFile: { type: String },
})

const buildFileTree = (diffs) => {
  const root = {}

  for (const diff of diffs) {
    const parts = diff.path.split('/')

    let current = root
    let accumulatedPath = ''

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i]
      accumulatedPath += (accumulatedPath ? '/' : '') + part

      if (!current[part]) {
        current[part] = {
          name: part,
          path: accumulatedPath,
          type: i === parts.length - 1 ? 'file' : 'folder',
          children: {},
        }
      }

      if (i === parts.length - 1) {
        current[part].diff = diff
      }

      current = current[part].children
    }
  }

  return root
}

// recursive
const flattenTree = (nodeMap) => {
  const result = {}

  for (const key in nodeMap) {
    let node = nodeMap[key]

    node.children = flattenTree(node.children)

    while (node.type === 'folder' && Object.keys(node.children).length === 1) {
      const childKey = Object.keys(node.children)[0]
      const child = node.children[childKey]

      if (child.type !== 'folder') break

      node.name = `${node.name}/${child.name}`
      node.path = `${node.path}/${child.name}`
      node.children = child.children
    }

    result[node.name] = node
  }

  return result
}

// recursive
const normalizeTree = (nodeMap) => {
  return Object.values(nodeMap).map((node) => ({
    ...node,
    children: normalizeTree(node.children),
  }))
}

const tree = computed(() => {
  if (!props.diffs.length) return []

  const fullTree = buildFileTree(props.diffs)
  const flattenedTree = flattenTree(fullTree)
  const normalizedTree = normalizeTree(flattenedTree)

  return normalizedTree
})

const collapsedFolders = ref(new Set())

const toggleFolder = (path) => {
  const next = new Set(collapsedFolders.value)

  if (next.has(path)) {
    next.delete(path)
  } else {
    next.add(path)
  }

  console.log(next)
  collapsedFolders.value = next
}

const emit = defineEmits(['selectFile'])
</script>

<template>
  <div
    class="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl overflow-hidden"
  >
    <div
      class="px-4 py-4 bg-[var(--color-bg-tertiary)] border-b border-[var(--color-border)] flex items-center justify-between"
    >
      <span class="text-sm font-semibold text-[var(--color-text-primary)]"> Files Changed </span>
      <span class="text-xs text-[var(--color-text-dim)]">{{ diffs.length }} file changes</span>
    </div>

    <div class="py-2">
      <FileTreeNode
        v-for="node in tree"
        :key="node.path"
        :node="node"
        :depth="0"
        :collapsedFolders="collapsedFolders"
        :selectedFile="props.selectedFile"
        @toggleFolder="toggleFolder"
        @selectFile="$emit('selectFile', $event)"
      />
    </div>
  </div>
</template>
