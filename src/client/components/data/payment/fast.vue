<template>
  <div>
    <UButton size="2xs" icon="i-bx-credit-card" @click="open = true">Nạp Thêm</UButton>

    <UModal v-model="open" preventClose>
      <UiContent title="Nạp Xu" sub="Hệ thống nạp xu vào tài khoản" class="p-4" no-dot>
        <template #more>
          <UButton icon="i-bx-x" class="ml-auto" size="2xs" color="gray" square @click="open = false"></UButton>
        </template>

        <DataPaymentCreate :fast="true"/>
      </UiContent>
    </UModal>
  </div>
</template>

<script setup>
const open = ref(false)
</script>