<template>
  <div class="max-w-[800px] mx-auto">
    <div class="mb-4">
      <USkeleton class="w-48 h-8 mb-1" />
      <USkeleton class="w-full h-8" />
    </div>

    <div style="aspect-ratio: 4 / 2">
      <USkeleton class="w-full h-full rounded-3xl shadow-md" />
    </div>

    <UiFlex class="py-4">
      <USkeleton class="w-10 h-10 rounded-full mr-2" />

      <UiFlex type="col" items="start">
        <USkeleton class="w-36 h-6 mb-2" />
        <USkeleton class="w-24 h-4" />
      </UiFlex>

      <USkeleton class="w-20 h-7 ml-auto" />
    </UiFlex>

    <USkeleton class="w-full h-10 mb-2" />
    <USkeleton class="w-full h-24 mb-2" />
    <USkeleton class="w-full h-5" />
  </div>
</template>