<template>
  <UiFlex>
    <UInput icon="i-bx-search" size="md" placeholder="Tìm kiếm" readonly class="hidden lg:inline-block" @click="modal = true" />
    <UButton color="gray" icon="i-bx-search" square class="lg:hidden" @click="modal = true" />
  </UiFlex>
</template>

<script setup>
const modal = ref(false)
</script>