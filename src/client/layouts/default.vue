<template>
  <div class="LayoutPublic relative h-full min-h-full">
    <div class="
      LayoutPublicNav 
      border-r border-gray-100 dark:border-gray-800
      min-h-full h-full
      dark:bg-gray-900 backdrop-blur-xl
    ">
      <LayoutPublicNav />
    </div>

    <div class="LayoutPublicMain relative">
      <LayoutPublicHeader />

      <UContainer class="relative py-4 sm:py-6 lg:py-8" :ui="{ constrained: 'max-w-[1200px] w-full' }" style="min-height: calc(100% - var(--header-size));">
        <slot></slot>
      </UContainer>
    </div>

    <div class="
      LayoutPublicNavRight 
      border-l border-gray-100 dark:border-gray-800
      min-h-full h-full
      dark:bg-gray-900 backdrop-blur-xl
    ">
      <SocketChatGlobal />
    </div>
  </div>
</template>

<script setup>
</script>

<style lang="sass">
.LayoutPublic
  display: grid
  grid-template-areas: "main"
  @media (min-width: 1024px)
    display: grid
    grid-template-columns: var(--nav-size) 1fr var(--nav-right-size)
    grid-template-areas: "nav main nav-right"

  .LayoutPublicNav
    position: fixed
    top: 0
    left: calc(var(--nav-size) * -1)
    grid-area: nav
    min-width: var(--nav-size)
    max-width: var(--nav-size)
    min-height: 100%
    max-height: 100%
    z-index: 2
    transition: all 0.25s ease
    &--open
      left: 0
    @media (min-width: 1024px)
      left: 0

  .LayoutPublicNavRight
    position: fixed
    top: 0
    right: calc(var(--nav-right-size) * -1)
    grid-area: nav-right
    min-width: var(--nav-right-size)
    max-width: var(--nav-right-size)
    min-height: 100%
    max-height: 100%
    z-index: 2
    transition: all 0.25s ease
    &--open
      right: 0
    @media (min-width: 1024px)
      right: 0

  .LayoutPublicMain
    grid-area: main
    z-index: 1
</style>