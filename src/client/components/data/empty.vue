<template>
  <UiFlex type="col" justify="center" class="p-4">
    <UiImg src="/images/icon/empty.png" w="1" h="1" imgW="300" imgH="300" class="w-[120px] h-[120px] mb-2" v-if="!loading" />

    <UiFlex class="mb-2" justify="center" v-else>
      <UiIcon name="i-bx-loader-alt" size="10" class="animate-spin" color="primary" />
    </UiFlex>

    <UiText color="gray" align="center" size="sm">{{ !!loading ? 'Đang tải...' : text }}</UiText>
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
  },
  loading: {
    type: Boolean,
    default: false
  }
})
</script>