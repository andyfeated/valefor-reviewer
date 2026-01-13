<script setup lang="ts">
import { Toaster } from 'vue-sonner'
import 'vue-sonner/style.css' // Add this line
</script>

<template>
  <Toaster
    :theme="'dark'"
    :toastOptions="{
      style: {
        background: 'var(--color-bg-secondary)',
        border: '1px solid var(--color-border)',
        color: 'var(--color-text-primary)',
      },
    }"
  />

  <router-view />
</template>

<style></style>
