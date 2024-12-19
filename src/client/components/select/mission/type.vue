<template>
  <USelectMenu 
    v-model="type" 
    size="lg" 
    value-attribute="value"
    :options="options"
  >
    <template #label>
      <span>{{ type ? typeFormat[type] : 'Chọn loại nhiệm vụ' }}</span>
    </template>
  </USelectMenu>
</template>

<script setup>
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const type = ref(props.modelValue)
watch(type, (value) => {
  emit('update:modelValue', value)
})

const typeFormat = {
  'pay.first': 'Nạp Đầu',
  'pay.success': 'Nạp Tiền',

  'vip.upgrade': 'Nâng VIP',

  'game.private.play': 'Chơi Game Private',
  'game.private.comment': 'Bình Luận Game Private',
  'game.private.shopping': 'Mua Hàng Game Private',

  'game.china.play': 'Chơi Game China',
  'game.china.comment': 'Bình Luận Game China',
  'game.china.pay.success': 'Nạp Tiền Nền Tảng Game China',

  'game.tool.buy': 'Mua Tool Game',
  'game.tool.comment': 'Bình Luận Game Tool',

  // 'forum.post': 'Tạo Bài Viết Diễn Đàn',
  // 'forum.comment': 'Bình Luận Bài Viết Diễn Đàn',
  // 'forum.like': 'Thích Bài Viết Diễn Đàn',

  // 'share.link': 'Chia Sẻ Link',
  // 'click.link': 'Bấm Link',
}

const options = computed(() => {
  const list = []
  for (const [key, value] of Object.entries(typeFormat)) {
    list.push({ label: value, value: key })
  }
  return list
})
</script>