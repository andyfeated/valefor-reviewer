<script setup>
import { motion } from 'motion-v'
import Navbar from '@/components/Navbar.vue'
import FileTree from '@/components/FileTree.vue'
import CodeDiff from '@/components/CodeDiff.vue'
import { onMounted, onUnmounted, ref, toRaw } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const { id } = route.params

let eventSource = null

const reviewData = ref(null)
const diffsData = ref([])

const collapsedSet = ref(new Set())

const toggleCollapsed = (diffId) => {
  if (collapsedSet.value.has(diffId)) {
    collapsedSet.value.delete(diffId)
    return
  }

  collapsedSet.value.add(diffId)
}

const isExpanded = (diffId) => !collapsedSet.value.has(diffId)

const selectedFile = ref(null)

const selectFile = (path) => {
  selectedFile.value = path

  const element = document.getElementById(`file-${path}`)

  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

onMounted(async () => {
  try {
    const res = await fetch(`${import.meta.env.VITE_BASE_API_URL}/review/${id}`, {
      credentials: 'include',
    })

    if (!res.ok) {
      throw new Error('Error occured')
    }

    const review = await res.json()

    const sortedDiffs = [...(review.diffs ?? [])].sort((a, b) => {
      return Number(b.isValid) - Number(a.isValid)
    })

    reviewData.value = review
    diffsData.value = sortedDiffs ?? []

    if (review.status === 'pending') {
      subscribeToStatusUpdate()
    }
  } catch (err) {
    console.error(err)
  }

  window.addEventListener('beforeunload', handleBeforeUnload)
})

const subscribeToStatusUpdate = () => {
  eventSource = new EventSource(`${import.meta.env.VITE_BASE_API_URL}/review/${id}/events`, {
    withCredentials: true,
  })

  eventSource.onmessage = (event) => {
    const review = JSON.parse(event.data)

    if (review.status === 'pending') {
      return
    }

    if (review.status === 'done') {
      reviewData.value = {
        ...reviewData.value,
        status: review.status,
        updatedAt: review.updatedAt,
        diffs: review.diffs ?? [],
      }
      diffsData.value = review.diffs ?? []
    }

    if (review.status === 'failed') {
      reviewData.value = { ...reviewData.value, status: review.status }
      console.error('An error occured')
    }

    eventSource.close()
    eventSource = null
  }
}

const handleBeforeUnload = () => {
  if (eventSource) {
    eventSource.close()
    eventSource = null
  }
}

onUnmounted(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload)

  if (eventSource) {
    eventSource.close()
    eventSource = null
  }
})
</script>

<template>
  <Navbar :review="reviewData" :displayPrInfo="true" />

  <div class="max-w-[1350px] mx-auto p-8">
    <div class="grid grid-cols-4 gap-7">
      <motion.div
        :initial="{ x: -20, opacity: 0 }"
        :animate="{ x: 0, opacity: 1 }"
        :transition="{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }"
        class="col-span-1"
      >
        <div class="sticky top-8">
          <FileTree :diffs="diffsData" :selectedFile="selectedFile" @selectFile="selectFile" />
        </div>
      </motion.div>

      <motion.div
        :initial="{ x: 20, opacity: 0 }"
        :animate="{ x: 0, opacity: 1 }"
        :transition="{ duration: 0.4, delay: 0.2, ease: [0.22, 1, 0.36, 1] }"
        class="col-span-3 space-y-6"
      >
        <CodeDiff
          v-for="diff in diffsData"
          :status="reviewData.status"
          :key="diff.id"
          :diff="diff"
          :is-expanded="isExpanded(diff.id)"
          @toggle-collapse="toggleCollapsed(diff.id)"
        />
      </motion.div>
    </div>
  </div>
</template>

<style></style>
