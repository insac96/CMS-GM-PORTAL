<template>
  <UiContent class="w-full max-w-[700px] mx-auto" title="..." sub="..." no-dot>
    <USkeleton class="w-full" style="aspect-ratio: 16 / 9" />

    <UiFlex class="gap-2 my-4">
      <USkeleton class="w-14 h-14" />

      <div>
        <USkeleton class="w-12 h-5 mb-1" />
        <UiFlex wrap class="gap-1">
          <USkeleton class="h-5 w-14" />
          <USkeleton class="h-5 w-14" />
        </UiFlex>
      </div>

      <USkeleton class="ml-auto h-4 w-16" />
    </UiFlex>

    <UiFlex type="col" items="start" class="my-4">
      <USkeleton class="max-w-[200px] w-full h-4 mb-1" />
      <USkeleton class="max-w-[400px] w-full h-6 mb-1" />
      <USkeleton class="max-w-[600px] w-full h-8 mb-1" />
      <USkeleton class="max-w-[1200px] w-full h-24 mb-1" />
    </UiFlex>
  </UiContent>
</template>