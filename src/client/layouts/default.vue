<template>
  <div class="LayoutPublic relative h-full min-h-full">
    <div class="LayoutPublicNav hidden lg:block border-r border-gray-200 min-h-full h-full">
      <LayoutPublicNav />
    </div>

    <div class="LayoutPublicMain relative">
      <LayoutPublicHeader />

      <Transition name="fade">
        <svg viewBox="0 0 1440 181" fill="none" xmlns="http://www.w3.org/2000/svg" class="absolute inset-x-0 top-[var(--header-size)] w-full block" v-if="route.fullPath == '/'">
          <mask id="path-1-inside-1_1086_7239" fill="white">
            <path d="M0 0H1440V181H0V0Z"></path>
          </mask>
          <path d="M0 0H1440V181H0V0Z" fill="url(#paint0_linear_1086_7239)" fill-opacity="0.22"></path>
          <path d="M0 2H1440V-2H0V2Z" fill="url(#paint1_linear_1086_7239)" mask="url(#path-1-inside-1_1086_7239)"></path>
          <defs>
            <linearGradient id="paint0_linear_1086_7239" x1="720" y1="0" x2="720" y2="181" gradientUnits="userSpaceOnUse">
              <stop stop-color="rgb(var(--color-primary-DEFAULT))"></stop><stop offset="1" stop-color="rgb(var(--color-primary-DEFAULT))" stop-opacity="0"></stop>
            </linearGradient>
            <linearGradient id="paint1_linear_1086_7239" x1="0" y1="90.5" x2="1440" y2="90.5" gradientUnits="userSpaceOnUse">
              <stop stop-color="rgb(var(--color-primary-DEFAULT))" stop-opacity="0"></stop>
              <stop offset="0.395" stop-color="rgb(var(--color-primary-DEFAULT))"></stop>
              <stop offset="1" stop-color="rgb(var(--color-primary-DEFAULT))" stop-opacity="0"></stop>
            </linearGradient>
          </defs>
        </svg>
      </Transition>

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