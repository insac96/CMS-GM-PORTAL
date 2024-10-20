<template>
  <USelectMenu 
    v-model="type" 
    size="lg" 
    value-attribute="value"
    placeholder="Chọn quyền"
    :options="[
      { label: 'MEMBER', value: 0 },
      { label: 'G-MOD', value: 1 },
      { label: 'F-MOD', value: 2 },
      { label: 'ADMIN', value: 100 },
    ]"
  >
    <template #label>
      <UiDot :color="typeFormat[type].color" v-if="type !== undefined" />
      <span v-if="type !== undefined">{{ typeFormat[type].label }}</span>
      <span v-else>Chọn quyền</span>
    </template>

    <template #option="{ option: option }">
      <UiDot :color="typeFormat[option.value].color" />
      <span>{{ typeFormat[option.value].label }}</span>
    </template>
  </USelectMenu>
</template>

<script setup>
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const type = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
}) 

const typeFormat = {
  0: { label: 'MEMBER', color: 'gray' },
  1: { label: 'G-MOD', color: 'green' },
  2: { label: 'F-MOD', color: 'cyan' },
  100: { label: 'ADMIN', color: 'red' },
  99: { label: 'ROBOT', color: 'orange' }
}
</script>