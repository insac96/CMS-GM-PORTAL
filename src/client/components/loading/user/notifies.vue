<template>
  <UiFlex class="w-full my-2 h-16" v-for="i in 5" :key="i">
    <USkeleton class="h-6 w-6 mr-2" :ui="{ rounded: 'rounded-full' }" />
    <UiFlex type="col" class="grow">
      <UiFlex class="w-full mb-2" justify="between">
        <USkeleton class="h-2 w-24" />
        <USkeleton class="h-2 w-10" />
      </UiFlex>
      <USkeleton class="h-4 w-full" />
    </UiFlex>
  </UiFlex>
</template>