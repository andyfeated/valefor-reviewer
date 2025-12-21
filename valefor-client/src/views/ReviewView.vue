<script setup>
import Navbar from '@/components/Navbar.vue'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const { id } = route.params
const reviewData = ref(null)

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
  } catch (err) {
    console.error(err)
  }
})
</script>

<template>
  <Navbar :review="reviewData" :displayPrInfo="true" />
</template>

<style></style>
