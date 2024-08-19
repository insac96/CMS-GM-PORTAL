<template>
  <UCard
    class="overflow-hidden"
    :ui="{ 
      base: 'relative transition-all ',
      rounded: 'rounded-3xl',
      shadow: 'shadow-md hover:shadow-lg',
      body: { padding: 'py-2 sm:py-2 px-4 sm:px-4' },
      header: { padding: 'p-0 sm:p-0' },
      footer: { padding: 'pt-0 sm:pt-0 px-4 sm:px-4' },
      divide: '',
      ring: 'dark:ring-1 ring-0'
    }"
  > 
    <template #header>
      <div style="aspect-ratio: 4 / 2">
        <USkeleton class="w-full h-full rounded-none" />
      </div>
    </template>

    <USkeleton class="w-32 h-4 mb-1" />
    <USkeleton class="w-full h-8" />

    <template #footer>
      <UiFlex justify="between">
        <USkeleton class="w-24 h-4" />
        <USkeleton class="w-20 h-4" />
      </UiFlex>
    </template>
  </UCard>
</template>