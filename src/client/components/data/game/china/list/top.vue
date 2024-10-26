<template>
  <div>
    <UTabs :items="items" @change="onTabChange" />
    <DataGameListMini :list="list" os="china" />
  </div>
</template>

<script setup>
const list = ref([])
const loading = ref(true)

const items = [
  { label: 'Người chơi'},
  { label: 'Lượt chơi'},
  { label: 'Lượt xem'},
]
const itemValue = {
  0: 'statistic.user',
  1: 'statistic.play',
  2: 'statistic.view',
}
const page = ref({
  size: 9,
  current: 1,
  sort: {
    column: 'createdAt',
    direction: 'desc'
  },
  total: 0
})

const onTabChange = async (index) => {
  const item = itemValue[index]
  page.value.sort.column = item
  await getList()
}

const getList = async () => {
  try {
    loading.value = true
    const data = await useAPI('game/china/public/list/top', JSON.parse(JSON.stringify(page.value)))

    list.value = data
    setTimeout(() => loading.value = false, 700)
  }
  catch (e) {
    loading.value = false
  } 
}

onMounted(() => setTimeout(getList, 1))
</script>