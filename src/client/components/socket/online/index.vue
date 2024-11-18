<template>
  <UButton icon="i-bx-group" color="gray">{{ socketStore.online }}</UButton>
</template>

<script setup>
const socketStore = useSocketStore()
</script>