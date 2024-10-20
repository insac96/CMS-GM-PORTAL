<template>
  <UiFlex class="gap-1">
    <UiText :size="size" weight="semibold" class="capitalize" color="primary">{{ !!user ? user.username : 'Ẩn danh'}}</UiText>
    <img :src="`/images/user/stone/${!!user ? (user.level || 4) : 1}.webp`" width="15" height="15"/>
  </UiFlex>
</template>

<script setup>
const props = defineProps({
  user: { type: Object },
  size: { type: String, default: 'sm' }
})
</script>
