<template>
  <UButton icon="i-bx-group" color="gray">{{ socketStore.online + 200 }}</UButton>
</template>

<script setup>
const socketStore = useSocketStore()
</script>