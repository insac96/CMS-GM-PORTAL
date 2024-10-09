<template>
  <header class="
    LayoutPublicHeader 
    sticky top-0 z-50 
    bg-white/75 dark:bg-transparent
    backdrop-blur-xl 
    flex items-center gap-1
    h-[var(--header-size)] max-h-[var(--header-size)]
    px-4
    border-b border-gray-100 dark:border-gray-800
  ">
    <LayoutPublicNavHeader class="lg:hidden" />

    <LayoutPublicHeaderSearch />
    
    <UiFlex justify="end" items="center" class="ml-auto">
      <AuthSign v-if="!authStore.isLogin" />
      <LazyAuthHeader v-else />
    </UiFlex>
  </header>
</template>

<script setup>
const authStore = useAuthStore()
</script>