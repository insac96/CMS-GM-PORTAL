<template>
  <USelectMenu
    v-model="itemSelect"
    :searchable="searchItem"
    :multiple="props.multiple"
    size="lg"
    by="_id"
    class="grow"
  >
    <template #label>
      {{ !!select ? select.name : 'Tìm kiếm vật phẩm' }}
    </template>

    <template #option="{ option: item }">
      {{ item.name }}
    </template>
  </USelectMenu>
</template>

<script setup>
const props = defineProps({
  modelValue: String,
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
  const items = await useAPI('game/tool/public/project/mail/items', { key: key, game: props.game })

  return items.map(i => ({
    item_id: i.item_id,
    name: i.item_name,
  })).filter(Boolean)
}
</script>