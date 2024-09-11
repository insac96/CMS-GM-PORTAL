<template>
  <UTabs v-model="tab" :items="items" :content="false">
    <template #default="{ item }">
      <UiFlex class="gap-1">
        <span class="truncate hidden sm:block">{{ item.label.split(' ')[0] }}</span>
        <span class="truncate">{{ item.label.split(' ')[1] }}</span>
      </UiFlex>
    </template>
  </UTabs>
</template>

<script setup>
const props = defineProps({
  modelValue: String,
})
const emit = defineEmits(['update:modelValue'])

const tab = ref(null)
const select = ref({
  0: 'tool',
  1: 'private',
  2: 'china'
})
const items = [{
  label: 'Game Tool',
  icon: 'i-ion-game-controller',
}, {
  label: 'Game Private',
  icon: 'i-fluent-games-28-filled',
  disabled: true
}, {
  label: 'Game China',
  icon: 'i-jam-gamepad-f',
}]

watch(() => tab.value, (val) => emit('update:modelValue', select.value[val]))
</script>