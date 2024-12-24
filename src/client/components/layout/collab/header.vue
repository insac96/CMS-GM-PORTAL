<template>
  <header class="
    sticky top-0 z-50 
    bg-white/75 dark:bg-gray-900 backdrop-blur-xl
    border-b border-gray-200 dark:border-gray-800
    px-4
  ">
    <UiFlex class="h-[var(--header-size)] max-h-[var(--header-size)]">
      <UiFlex class="hidden md:flex">
        <NuxtLink to="/manage/@eni">
          <UiLogo />
        </NuxtLink>
      </UiFlex>
      
      <UiFlex justify="end" items="center" class="gap-1 ml-auto">
        <!-- <Setting /> -->

        <AuthHeader v-if="!!authStore.isLogin" />

        <NuxtLink to="/">
          <UButton  icon="i-bx-power-off" color="red" square />
        </NuxtLink>
      </UiFlex>
    </UiFlex>
  </header>
</template>

<script setup>
const authStore = useAuthStore()


</script>