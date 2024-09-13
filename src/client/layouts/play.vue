<template>
  <div class="relative w-full h-full min-w-full min-h-full max-w-full max-h-full overflow-hidden">
    <slot></slot>
  </div>
</template>

<script setup>
const authStore = useAuthStore()
watch(() => authStore.isLogin, (val) => !val && useTo().navigateToSSL('/'))
</script>