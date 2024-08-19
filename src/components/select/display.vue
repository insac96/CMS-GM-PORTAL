<template>
  <USelectMenu 
    v-model="display" 
    size="lg" 
    value-attribute="value"
    :options="[
      { label: 'Hiện', value: true },
      { label: 'Ẩn', value: false }
    ]"
  >
    <template #label>
      <span v-if="display === undefined">Chọn loại</span>
      <span v-else>{{ !!display ? 'Hiện' : 'Ẩn' }}</span>
    </template>
  </USelectMenu>
</template>

<script setup>
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const display = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
}) 
</script>