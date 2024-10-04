<template>
  <div>
    <UCard :ui="{ 
      body: { padding: 'p-0 sm:p-0' },
      header: { padding: 'px-3 sm:px-3 py-2 sm:py-2' },
      footer: { padding: 'p-2 sm:p-2' },
    }">
      <template #header>
        <UiFlex>
          <USelectMenu v-model="page.size" :options="[5,10,20,50,100]" class="mr-1" />

          <UForm @submit="getList" class="max-w-[9rem] mr-auto">
            <UInput v-model="page.search.key" placeholder="Tìm kiếm..." icon="i-bx-search" size="sm"></UInput>
          </UForm>
          
          <SelectDate time v-model="page.range.start" placeholder="Bắt đầu" size="sm" class="ml-1 max-w-[140px]"/>
          <SelectDate time v-model="page.range.end" placeholder="Kết thúc" size="sm" class="ml-1 max-w-[140px]"/>
        </UiFlex>
      </template>

      <LoadingTable v-if="loading.load" />

      <UTable v-model:sort="page.sort" :columns="columns" :rows="list">
        <template #code-data="{ row }">
          <UiText color="primary" weight="semibold">{{ row.code }}</UiText>
        </template>

        <template #coin-data="{ row }">
          <UBadge size="sm" color="gray">{{ useMoney().toMoney(row.coin) }}</UBadge>
        </template>

        <template #gcoin-data="{ row }">
          <UBadge size="sm" color="gray">{{ useMoney().toMoney(row.coin) }}</UBadge>
        </template>

        <template #createdAt-data="{ row }">
          {{ useDayJs().displayFull(row.createdAt) }}
        </template>
      </UTable>

      <template #footer>
        <UiFlex justify="end">
          <UPagination class="ml-auto" v-model="page.current" :page-count="page.size" :total="page.total" :max="5" />
        </UiFlex>
      </template>
    </UCard>
  </div>
</template>

<script setup>
const props = defineProps(['user', 'game', 'reload'])

const loading = ref({
  load: true,
})

const list = ref([])

const columns = [
  {
    key: 'code',
    label: 'Mã',
  },{
    key: 'coin',
    label: 'Xu mua',
    sortable: true
  },{
    key: 'gcoin',
    label: 'GCoin nhận',
    sortable: true
  },{
    key: 'createdAt',
    label: 'Ngày tạo',
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
  search: {
    key: null,
    by: 'code'
  },
  range: {
    start: null,
    end: null
  },
  total: 0,
  user: props.user || null,
  game: props.game
})
watch(() => page.value.size, () => getList())
watch(() => page.value.current, () => getList())
watch(() => page.value.sort.column, () => getList())
watch(() => page.value.sort.direction, () => getList())
watch(() => page.value.search.key, (val) => !val && getList())
watch(() => page.value.range.start, (val) => {
  if(!!val && !!page.value.range.end) return getList()
  if(!val && !page.value.range.end) return getList()
})
watch(() => page.value.range.end, (val) => {
  if(!!val && !!page.value.range.start) return getList()
  if(!val && !page.value.range.start) return getList()
})
watch(() => props.reload, () => getList())

const getList = async () => {
  try {
    loading.value.load = true
    const data = await useAPI('game/private/public/payment/history', JSON.parse(JSON.stringify(page.value)))

    loading.value.load = false
    list.value = data.list
    page.value.total = data.total
  }
  catch (e) {
    loading.value.load = false
  } 
}

onMounted(() => setTimeout(getList, 1))
</script>