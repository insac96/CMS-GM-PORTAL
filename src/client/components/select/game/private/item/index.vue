<template>
  <USelectMenu
    v-model="itemSelect"
    :searchable="searchItem"
    size="lg"
    by="_id"
    class="grow"
    debounce
  >
    <template #label>
      {{ !!select ? select.item_name : 'Tìm kiếm vật phẩm' }}
    </template>

    <template #option="{ option: item }">
      {{ item.item_name }}
    </template>
  </USelectMenu>
</template>

<script setup>
const props = defineProps({
  modelValue: Object,
  itemData: Object,
  game: String
})

const emit = defineEmits(['update:modelValue', 'update:itemData'])

const itemSelect = ref(props.modelValue)

const select = ref(undefined)

watch(itemSelect, val => {
  select.value = val
  if(!val) return 

  emit('update:modelValue', val._id)
  emit('update:itemData', val)
})

const searchItem = async (key) => {
  const items = await useAPI('game/private/manage/item/select', { key: key, game: props.game })
  return items.filter(Boolean)
}
</script>