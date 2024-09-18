<template>
  <UiContent title="Nạp Xu" sub="Hệ thống nạp xu vào tài khoản">
    <DataPaymentCreate />
  </UiContent>
</template>

<script setup>
const configStore = useConfigStore()
useSeoMeta({
  title: () => `Nạp Xu - ${configStore.config.name}`,
  ogTitle: () => `Nạp Xu - ${configStore.config.name}`,
  description: () => 'Hệ thống nạp xu vào tài khoản với các ưu đãi hấp dẫn',
  ogDescription: () => 'Hệ thống nạp xu vào tài khoản với các ưu đãi hấp dẫn',
})
</script>