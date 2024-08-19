<template>
  <USelectMenu 
    v-model="block" 
    size="lg" 
    value-attribute="value"
    placeholder="Chọn loại"
    :options="[
      { label: 'Có', value: true },
      { label: 'Không', value: false }
    ]"
  >
    <template #label>
      <span v-if="block === undefined">Chọn loại</span>
      <span v-else>{{ !!block ? 'Có' : 'Không' }}</span>
    </template>
  </USelectMenu>
</template>

<script setup>
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const block = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
}) 
</script>