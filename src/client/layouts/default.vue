<template>
  <div class="relative h-full min-h-full">
    <LayoutPublicHeader />
    
    <UContainer class="min-h-[calc(100%-var(--header-size)-var(--footer-size))] max-w-[800px] mx-auto">
      <main class="pb-6 pt-10">
        <slot></slot>
      </main>
    </UContainer>

    <LayoutFooter />
  </div>
</template>