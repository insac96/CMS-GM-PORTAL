<template>
  <UiContent title="Đề Xuất" sub="Các trò chơi liên quan">
    <DataGameListMini :list="list" :os="os" />
  </UiContent>
</template>

<script setup>
const props = defineProps(['os', 'platform', 'category'])
const list = ref([])
const loading = ref(false)
const page = ref({
  size: 5,
  current: 1,
  sort: {
    column: 'statistic.play',
    direction: 'desc'
  },
  platform: props.platform || [],
  category: props.category || [],
  total: 0
})

const getList = async () => {
  try {
    loading.value = true
    const data = await useAPI('game/tool/public/list/main', JSON.parse(JSON.stringify(page.value)))

    loading.value = false
    list.value = data.list
    page.value.total = data.total
  }
  catch (e) {
    loading.value = false
  } 
}

onMounted(() => setTimeout(getList, 1))
</script>