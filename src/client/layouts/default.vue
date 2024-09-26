<template>
  <div class="LayoutPublic relative h-full min-h-full">
    <div class="
      LayoutPublicNav 
      hidden lg:block 
      border-r border-gray-100 min-h-full h-full
      bg-white/75 dark:bg-transparent backdrop-blur-xl
    ">
      <LayoutPublicNav />
    </div>

    <div class="LayoutPublicMain relative">
      <LayoutPublicHeader />

      <UContainer class="py-4 sm:py-6 lg:py-8" :ui="{ constrained: 'max-w-[1100px] w-full' }">
        <slot></slot>
      </UContainer>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
</script>

<style lang="sass">
.LayoutPublic
  @media (min-width: 1024px)
    display: grid
    grid-template-columns: var(--nav-size) 1fr
    grid-template-areas: "nav main"
  .LayoutPublicNav
    position: fixed
    top: 0
    left: 0
    grid-area: nav
    min-width: var(--nav-size)
    max-width: var(--nav-size)
    min-height: 100%
    max-height: 100%
  .LayoutPublicMain
    grid-area: main

  .fade-enter-active, .fade-leave-active
    transition: all 0.5s ease
  .fade-enter-from, .fade-leave-to
    opacity: 0
</style>