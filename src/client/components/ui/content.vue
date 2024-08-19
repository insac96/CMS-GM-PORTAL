<template>
  <div>
    <UiFlex type="col" justify="center" :items="!!start ? 'start' : 'center'" class="mb-6">
      <UiText align="center" class="font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl text-xl">{{ title }}</UiText>
      <UiText align="center" color="gray" class="tracking-tight sm:text-xl text-lg">{{ sub }}</UiText>
    </UiFlex>

    <slot></slot>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  sub: String,
  start: { type: Boolean, default: true },
})

const slots = defineSlots()
</script>