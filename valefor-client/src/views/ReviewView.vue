<script setup>
import { motion } from 'motion-v'
import Navbar from '@/components/Navbar.vue'
import CodeDiff from '@/components/CodeDiff.vue'
import { onMounted, ref, toRaw } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const { id } = route.params

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

onMounted(async () => {
  try {
    const res = await fetch(`${import.meta.env.VITE_BASE_API_URL}/review/${id}`, {
      credentials: 'include',
    })

    if (!res.ok) {
      throw new Error('Error occured')
    }

    const review = await res.json()
    reviewData.value = review
    diffsData.value = review.diffs ?? []
  } catch (err) {
    console.error(err)
  }
})
</script>

<template>
  <Navbar :review="reviewData" :displayPrInfo="true" />

  <div class="max-w-7xl mx-auto p-8">
    <div class="grid grid-cols-4 gap-6">
      <motion.div class="col-span-1">
        <span class="text-white">file tree here</span>
      </motion.div>

      <motion.div
        :initial="{ x: 20, opacity: 0 }"
        :animate="{ x: 0, opacity: 1 }"
        :transition="{ duration: 0.4, delay: 0.2, ease: [0.22, 1, 0.36, 1] }"
        class="col-span-3 space-y-6"
      >
        <CodeDiff
          v-for="diff in diffsData"
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
