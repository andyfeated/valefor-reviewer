<script setup>
import {
  UserIcon,
  GithubIcon,
  GitlabIcon,
  CheckCircleIcon,
  LinkIcon,
  LogOutIcon,
} from 'lucide-vue-next'
import { onMounted, onUnmounted, ref } from 'vue'
import { AnimatePresence, motion } from 'motion-v'
import { useAuth } from '@/composables/useAuth'
import { useRouter } from 'vue-router'

const { user, providers, logout } = useAuth()
const router = useRouter()

const isGitlabLinked = providers.value.some((p) => p.provider === 'gitlab')
const isGithubLinked = providers.value.some((p) => p.provider === 'github')

const isOpen = ref(false)
const dropDownRef = ref(null)

const handleLogout = async () => {
  await logout()
  router.push('/login')
}

const handleClickOutside = (event) => {
  if (dropDownRef.value && !dropDownRef.value.contains(event.target)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
})

onUnmounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
})
</script>
<template>
  <div class="relative" ref="dropDownRef">
    <button
      @click="isOpen = !isOpen"
      class="cursor-pointer p-2 bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] rounded-lg hover:border-[var(--color-border-bright)] hover:bg-[var(--color-bg-secondary)] transition-all"
    >
      <UserIcon class="w-6 h-6 text-[var(--color-text-secondary)]" />
    </button>

    <AnimatePresence>
      <motion.div
        v-if="isOpen"
        :initial="{ opacity: 0, y: -10, scale: 0.95 }"
        :animate="{ opacity: 1, y: 0, scale: 1 }"
        :exit="{ opacity: 0, y: -10, scale: 0.95 }"
        :transition="{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }"
        class="absolute right-0 mt-2 w-72 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl shadow-xl overflow-hidden z-50"
      >
        <div
          class="px-4 py-3 border-b border-[var(--color-border)] bg-[var(--color-bg-tertiary)] rounded-t-xl"
        >
          <p class="text-sm font-semibold text-[var(--color-text-primary)]">
            {{ user?.name }}
          </p>
        </div>

        <div class="p-3">
          <p class="mt-1 text-xs font-semibold text-[var(--color-text-secondary)] mb-3 px-2">
            Linked Accounts
          </p>

          <div class="space-y-1">
            <div
              class="cursor-pointer flex items-center justify-between p-2 rounded-lg hover:bg-[var(--color-bg-tertiary)] transition-colors"
            >
              <div class="flex items-center gap-3">
                <GithubIcon class="w-5 h-5 text-[var(--color-text-secondary)]" />
                <p class="text-sm font-medium text-[var(--color-text-primary)]">Github</p>
              </div>

              <div
                v-if="isGithubLinked"
                class="flex items-center gap-1.5 px-2 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full"
              >
                <CheckCircleIcon class="w-3.5 h-3.5 text-emerald-400" />
                <span class="text-xs font-medium text-emerald-400">Linked</span>
              </div>
              <div
                v-else
                class="flex items-center gap-1.5 px-2 py-1 bg-blue-500/10 border border-blue-500/30 rounded-full"
              >
                <LinkIcon class="w-3.5 h-3.5 text-blue-400" />
                <span class="text-xs font-medium text-blue-400">Link</span>
              </div>
            </div>

            <div
              class="cursor-pointer flex items-center justify-between p-2 rounded-lg hover:bg-[var(--color-bg-tertiary)] transition-colors"
            >
              <div class="flex items-center gap-3">
                <GitlabIcon class="w-5 h-5 text-[var(--color-text-secondary)]" />
                <p class="text-sm font-medium text-[var(--color-text-primary)]">Gitlab</p>
              </div>

              <div
                v-if="isGitlabLinked"
                class="flex items-center gap-1.5 px-2 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full"
              >
                <CheckCircleIcon class="w-3.5 h-3.5 text-emerald-400" />
                <span class="text-xs font-medium text-emerald-400">Linked</span>
              </div>
              <div
                v-else
                class="flex items-center gap-1.5 px-2 py-1 bg-blue-500/10 border border-blue-500/30 rounded-full"
              >
                <LinkIcon class="w-3.5 h-3.5 text-blue-400" />
                <span class="text-xs font-medium text-blue-400">Link</span>
              </div>
            </div>
          </div>
        </div>

        <div class="border-t border-[var(--color-border)]">
          <button
            class="cursor-pointer w-full flex items-center gap-3 px-4 py-3 text-rose-400 hover:bg-[var(--color-bg-tertiary)] transition-colors text-left"
            @click="handleLogout()"
          >
            <LogOutIcon class="w-4 h-4" />
            <span class="text-sm font-medium">Logout</span>
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  </div>
</template>
