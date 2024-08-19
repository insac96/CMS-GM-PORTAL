<template>
  <div>
    <UiFlex justify="between" class="py-1 px-4 pr-2 bg-primary-700 dark:bg-primary-600 text-white rounded-t-lg">
      <UiText weight="semibold" size="sm" mini>{{ title }}</UiText>
      <UiIcon name="i-bx-x" size="7" class="ml-4" pointer @click="emit('close')"/>
    </UiFlex>

    <div class="p-4">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
const props = defineProps(['title'])
const emit = defineEmits(['close'])
</script>