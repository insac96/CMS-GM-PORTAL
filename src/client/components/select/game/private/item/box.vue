<template>
  <USelectMenu
    v-model="item"
    searchable
    :options="options"
    size="sm"
    value-attribute="_id"
    option-attribute="name"
  >
    <template #label>
      <UiText mini>{{ select ? select.name : 'Chọn gói vật phẩm' }}</UiText>
    </template>
  </USelectMenu>
</template>

<script setup>
const props = defineProps({
  game: String
})
const emit = defineEmits(['change'])

const options = ref([])

const item = ref(null)

const select = computed(() => options.value.find(i => i._id === item.value))

watch(item, (val) => {
  if(!val) return
  const box = options.value.find(i => i._id === val)
  emit('change', box ? box.gift : [])
  item.value = null
})

const getList = async () => {
  const items = await useAPI('game/private/manage/item/box/select', {
    game: props.game
  })
  options.value = items
}

onMounted(() => setTimeout(getList, 1))
</script>