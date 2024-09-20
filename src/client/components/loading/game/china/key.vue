<template>
  <div class="grid grid-cols-12 gap-2 md:gap-4 mb-4">
    <div class="md:col-span-8 col-span-12">
      <USkeleton class="w-full" style="aspect-ratio: 16 / 9" />
    </div>

    <UiContent class="md:col-span-4 col-span-12" title="..." sub="..." no-dot>
      <!-- Tab -->
      <UiFlex wrap class="gap-1">
        <USkeleton class="h-6 w-16" />
        <USkeleton class="h-6 w-16" />
        <USkeleton class="h-6 w-16" />
      </UiFlex>

      <!-- Statistic -->
      <UiFlex class="my-4" justify="center">
        <UiFlex type="col" class="grow border-r">
          <USkeleton class="h-4 w-4 mb-1" />
          <USkeleton class="h-4 w-14" />
        </UiFlex>

        <UiFlex type="col" class="grow border-l">
          <USkeleton class="h-4 w-4 mb-1" />
          <USkeleton class="h-4 w-14" />
        </UiFlex>
      </UiFlex>

      <!-- Button -->
      <USkeleton class="h-10 w-full" />
    </UiContent>
  </div>
</template>