<template>
  <div class="LayoutPublic relative h-full min-h-full">
    <div class="LayoutPublicNav hidden lg:block border-r border-gray-100 min-h-full h-full">
      <LayoutPublicNav />
    </div>

    <div class="LayoutPublicMain">
      <LayoutPublicHeader />

      <UContainer class="min-h-[calc(100%-var(--header-size)-var(--footer-size))] max-w-[800px] mx-auto">
          <slot></slot>
      </UContainer>
    </div>
  </div>
</template>

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
</style>