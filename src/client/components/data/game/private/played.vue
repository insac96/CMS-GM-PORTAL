<template>
  <div>
    <UiFlex>
      <USelectMenu v-model="page.size" :options="[5,10,20,50,100]" class="mr-1" />

      <UForm @submit="getList" class="max-w-[9rem] mr-auto">
        <UInput v-model="page.search" placeholder="Tìm kiếm..." icon="i-bx-search" size="sm"></UInput>
      </UForm>
    </UiFlex>

    <LoadingTable v-if="loading" />

    <UTable v-model:sort="page.sort" :columns="columns" :rows="list">
      <template #game-data="{ row }">
        <NuxtLink :to="`/game/private/${row.game.key}`" target="_blank">
          <UiText color="primary" weight="semibold">{{ row.game.name }}</UiText>
        </NuxtLink>
      </template>

      <template #[`spend.total.coin-data`]="{ row }">
        {{ row.spend ? useMoney().toMoney(row.spend.total.coin) : '0' }}
      </template>

      <template #createdAt-data="{ row }">
        {{ useDayJs().displayFull(row.createdAt) }}
      </template>
    </UTable>

    <UiFlex justify="end">
      <UPagination class="ml-auto" v-model="page.current" :page-count="page.size" :total="page.total" :max="5" />
    </UiFlex>
  </div>
</template>

<script setup>
const props = defineProps(['user'])

const loading = ref(false)

const list = ref([])

const columns = [
  {
    key: 'game',
    label: 'Trò chơi',
  },{
    key: 'spend.total.coin',
    label: 'Tổng tiêu',
    sortable: true
  },{
    key: 'createdAt',
    label: 'Ngày bắt đầu',
    sortable: true
  }
]

const page = ref({
  size: 5,
  current: 1,
  sort: {
    column: 'createdAt',
    direction: 'desc'
  },
  search: null,
  total: 0,
  user: props.user || null
})
watch(() => page.value.size, () => getList())
watch(() => page.value.current, () => getList())
watch(() => page.value.sort.column, () => getList())
watch(() => page.value.sort.direction, () => getList())
watch(() => page.value.search, (val) => !val && getList())

const getList = async () => {
  try {
    loading.value = true
    const data = await useAPI('game/private/public/played', JSON.parse(JSON.stringify(page.value)))
    
    list.value = data.list
    page.value.total = data.total
    loading.value = false
  }
  catch (e) {
    loading.value = false
  } 
}

onMounted(() => setTimeout(getList, 1))
</script>