<template>
  <div class="LayoutPublic relative h-full min-h-full">
    <div class="
      LayoutPublicNav 
      hidden lg:block 
      border-r border-gray-100 dark:border-gray-800
      min-h-full h-full
      dark:bg-gray-900 backdrop-blur-xl
    ">
      <LayoutPublicNav />
    </div>

    <div class="LayoutPublicMain relative">
      <LayoutPublicHeader />

      <UContainer class="py-4 sm:py-6 lg:py-8" :ui="{ constrained: 'max-w-[1200px] w-full' }">
        <slot></slot>
      </UContainer>
    </div>

    <div class="
      LayoutPublicNavRight 
      hidden lg:block 
      border-l border-gray-100 dark:border-gray-800
      min-h-full h-full
      dark:bg-gray-900 backdrop-blur-xl
    ">
      <SocketChat />
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
</script>

<style lang="sass">
.LayoutPublic
  display: grid
  grid-template-columns: 0 1fr 0
  grid-template-areas: "nav main nav-right"
  @media (min-width: 1024px)
    display: grid
    grid-template-columns: var(--nav-size) 1fr var(--nav-right-size)
    grid-template-areas: "nav main nav-right"
  .LayoutPublicNav
    position: fixed
    top: 0
    left: 0
    grid-area: nav
    min-width: var(--nav-size)
    max-width: var(--nav-size)
    min-height: 100%
    max-height: 100%
  .LayoutPublicNavRight
    position: fixed
    top: 0
    right: 0
    grid-area: nav-right
    min-width: var(--nav-right-size)
    max-width: var(--nav-right-size)
    min-height: 100%
    max-height: 100%
  .LayoutPublicMain
    grid-area: main

  .fade-enter-active, .fade-leave-active
    transition: all 0.5s ease
  .fade-enter-from, .fade-leave-to
    opacity: 0
</style>