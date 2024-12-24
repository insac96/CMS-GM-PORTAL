<template>
  <div class="relative h-full min-h-full">
    <LayoutCollabHeader />

    <UContainer class="py-4">
      <slot></slot>
    </UContainer>
  </div>
</template>

<script setup>
const authStore = useAuthStore()
watch(() => authStore.isLogin, (val) => !val && navigateTo('/'))
</script>