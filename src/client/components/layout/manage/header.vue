<template>
  <header class="
    sticky top-0 z-50 
    bg-white/75 dark:bg-transparent backdrop-blur-xl
    border-b border-gray-200 dark:border-gray-800
    px-4
  ">
    <UiFlex justify="between" class="h-[var(--header-size)] max-h-[var(--header-size)]">
      <LayoutManageNavSlide class="w-1/3"/>
      
      <UiFlex class="w-1/3 xl:justify-start justify-center">
        <NuxtLink to="/manage/@eni">
          <UiLogo />
        </NuxtLink>
      </UiFlex>
      
      <UiFlex justify="end" items="center" class="w-1/3">
        <Setting />
        <AuthSlide v-if="!!authStore.isLogin" class="ml-1" />
      </UiFlex>
    </UiFlex>
  </header>
</template>

<script setup>
const authStore = useAuthStore()


</script>