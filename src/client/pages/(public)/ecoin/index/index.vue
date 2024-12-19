<template>
  <DataMission />
</template>

<script setup>
const configStore = useConfigStore()
useSeoMeta({
  title: () => `Nhiệm Vụ - ${configStore.config.name}`,
  ogTitle: () => `Nhiệm Vụ - ${configStore.config.name}`,
  description: () => 'Hoàn thành nhiệm vụ để kiếm về ECoin',
  ogDescription: () => 'Hoàn thành nhiệm vụ để kiếm về ECoin',
})
</script>