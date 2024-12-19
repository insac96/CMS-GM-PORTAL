<template>
  <DataEmpty text="Tính năng sắp ra mắt"></DataEmpty>
</template>

<script setup>
const configStore = useConfigStore()
useSeoMeta({
  title: () => `P2P - ${configStore.config.name}`,
  ogTitle: () => `P2P - ${configStore.config.name}`,
  description: () => 'Giao dịch tiền nền tảng ECoin giữa người chơi',
  ogDescription: () => 'Giao dịch tiền nền tảng ECoin giữa người chơi',
})
</script>