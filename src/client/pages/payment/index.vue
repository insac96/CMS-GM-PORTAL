<template>
  <UiContent title="Nạp Xu" sub="Tạo giao dịch mua xu">
    <MainActionPayment />
  </UiContent>
</template>

<script setup>
const configStore = useConfigStore()
useSeoMeta({
  title: () => `Nạp Xu - ${configStore.config.name}`,
})
</script>