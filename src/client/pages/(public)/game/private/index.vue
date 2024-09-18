<template>
  <UiContent title="Game Private" sub="Các trò chơi hay và hấp dẫn">
    <DataEmpty class="h-[300px]" text="Tính Năng Sắp Ra Mắt"></DataEmpty>
  </UiContent>
</template>

<script setup>
const configStore = useConfigStore()
useSeoMeta({
  title: () => `Game Private - ${configStore.config.name}`,
  ogTitle: () => `Game Private - ${configStore.config.name}`,
  description: () => 'Tính Năng Sắp Ra Mắt',
  ogDescription: () => 'Tính Năng Sắp Ra Mắt',
})
</script>