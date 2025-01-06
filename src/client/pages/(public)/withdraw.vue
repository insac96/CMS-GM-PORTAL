<template>
  <UiContent title="Rút VND" sub="Hệ thống rút VND về tài khoản ngân hàng" class="w-full max-w-[700px] mx-auto">
    <UCard>
      <DataEmpty text="Tính năng sắp ra mắt" class="h-[300px]"></DataEmpty>
    </UCard>
  </UiContent>
</template>

<script setup>
const configStore = useConfigStore()
useSeoMeta({
  title: () => `Rút VND - ${configStore.config.name}`,
  ogTitle: () => `Rút VND - ${configStore.config.name}`,
  description: () => 'Rút VND về tài khoản ngân hàng',
  ogDescription: () => 'Rút VND về tài khoản ngân hàng',
})
</script>