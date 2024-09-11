<template>
  <div class="LayoutPublic relative h-full min-h-full">
    <div class="LayoutPublicNav hidden lg:block border-r border-gray-200 min-h-full h-full">
      <LayoutPublicNav />
    </div>

    <div class="LayoutPublicMain">
      <LayoutPublicHeader />

      <div class="p-4">
        <slot></slot>
      </div>
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