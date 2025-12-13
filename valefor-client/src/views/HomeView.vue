<script setup lang="ts">
import { SparklesIcon } from 'lucide-vue-next'
import ProfileDropdown from '../components/ProfileDropdown.vue'
</script>

<template>
  <div class="min-h-screen bg-[var(--color-bg-primary)]">
    <div class="border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-8 py-6">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg">
            <SparklesIcon class="w-5 h-5 text-white" />
          </div>

          <h1 class="text-2xl font-bold text-white">Valefor AI Reviewer</h1>
        </div>
        <ProfileDropdown />
      </div>
    </div>
  </div>
</template>

<style></style>
