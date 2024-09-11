<template>
  <UiFlex type="col" justify="center" class="p-4">
    <UiImg src="/images/icon/empty.png" w="1" h="1" imgW="300" imgH="300" class="w-[120px] h-[120px] mb-2" />
    <UiText color="gray" align="center" size="sm">{{ text }}</UiText>
  </UiFlex>
</template>

<script setup>
defineProps({
  icon: {
    type: String,
    default: 'i-bx-data'
  },
  text: {
    type: String,
    default: 'Không tìm thấy dữ liệu'
  }
})
</script>