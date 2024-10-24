<template>
  <UiContent title="History Event" sub="Lịch sử nhận toàn hệ thống">
    <UiFlex class="mb-4">
      <USelectMenu v-model="page.size" :options="[5,10,20,50,100]" class="mr-1"/>

      <UForm :state="page" @submit="page.current = 1, getList()" class="mr-2">
        <UInput size="sm" v-model="page.search" placeholder="Tìm kiếm tài khoản" />
      </UForm>

      <USelectMenu 
        v-model="page.type" 
        value-attribute="key"
        option-attribute="label"
        :options="typeOptions"
        class="ml-auto"
				placeholder="Tất cả sự kiện"
      ></USelectMenu>  
    </UiFlex>
    
    <!-- Table -->
    <UCard :ui="{ body: { padding: 'p-0 sm:p-0' } }">
      <LoadingTable v-if="loading.load" />

      <UTable 
        v-model:sort="page.sort"
        :columns="selectedColumns"
        :rows="list"
      >
				<template #user-data="{ row }">
          <span v-if="!row.user">...</span>
          <UBadge v-else variant="soft" color="gray" class="cursor-pointer">
            {{ row.user.user.username }}
          </UBadge>
        </template>

        <template #type-data="{ row }">{{ typeFormat[row.event.type] }}</template>

        <template #need-data="{ row }">
          <UiText weight="semibold">{{ useMoney().toMoney(row.event.need) }}</UiText>
        </template>

        <template #createdAt-data="{ row }">
          {{ useDayJs().displayFull(row.createdAt) }}
        </template>

        <template #del-data="{ row }">
          <UButton color="gray" icon="i-bx-trash" :disabled="loading.del" @click="delAction(row._id)"/>
        </template>
      </UTable>
    </UCard>

    <!-- Pagination -->
    <UiFlex justify="between" class="py-4">
      <USelectMenu v-model="selectedColumns" :options="columns" multiple placeholder="Chọn cột" />
      <UPagination v-model="page.current" :page-count="page.size" :total="page.total" :max="4" />
    </UiFlex>
  </UiContent>
</template>

<script setup>
const game = useAttrs().game
const list = ref([])

// Columns
const columns = [
  {
    key: 'user',
    label: 'Tài khoản',
  },{
    key: 'type',
    label: 'Loại',
  },{
    key: 'need',
    label: 'Điều kiện',
  },{
    key: 'server',
    label: 'Máy chủ',
  },{
    key: 'role',
    label: 'Nhân vật',
  },{
    key: 'createdAt',
    label: 'Ngày nhận',
    sortable: true
  },{
    key: 'del',
    label: 'Xóa',
  }
]
const selectedColumns = ref([...columns])

// Page
const page = ref({
  size: 10,
  current: 1,
  sort: {
    column: 'createdAt',
    direction: 'desc'
  },
	search: null,
  type: null,
	game: game._id,
  total: 0,
})
watch(() => page.value.size, () => getList())
watch(() => page.value.current, () => getList())
watch(() => page.value.sort.column, () => getList())
watch(() => page.value.sort.direction, () => getList())
watch(() => page.value.type, (val) => getList())
watch(() => page.value.search, (val) => !val && getList())

// Loading
const loading = ref({
  load: true
})

// Type
const typeFormat = {
  'login.week': 'Điểm Danh Tuần',
  'login.month': 'Điểm Danh Tháng',
  'login.total': 'Điểm Danh Tổng',
  'spend.day.coin': 'Tiêu Phí Ngày',
  'spend.week.coin': 'Tiêu Phí Tuần',
  'spend.month.coin': 'Tiêu Phí Tháng',
  'spend.total.coin': 'Tiêu Phí Tổng',
}

const typeOptions = [
	{ label: 'Tất cả sự kiện', key: null },
	{ label: 'Điểm Danh Tuần', key: 'login.week' },
	{ label: 'Điểm Danh Tháng', key: 'login.month' },
	{ label: 'Điểm Danh Tổng', key: 'login.total' },
	{ label: 'Tiêu Phí Ngày', key: 'spend.day.coin' },
	{ label: 'Tiêu Phí Tuần', key: 'spend.week.coin' },
	{ label: 'Tiêu Phí Tháng', key: 'spend.month.coin' },
	{ label: 'Tiêu Phí Tổng', key: 'spend.total.coin' },
]

// Fetch
const getList = async () => {
  try {
    loading.value.load = true
    const data = await useAPI('game/private/manage/event/history/list', JSON.parse(JSON.stringify(page.value)))

    loading.value.load = false
    list.value = data.list
    page.value.total = data.total
  }
  catch (e) {
    loading.value.load = false
  } 
}

const delAction = async (_id) => {
  try {
    loading.value.del = true
    await useAPI('game/private/manage/event/history/del', { 
			_id: _id,
			game: game._id
		})

    loading.value.del = false
    getList()
  }
  catch (e) {
    loading.value.del = false
  }
}

onMounted(() => setTimeout(getList, 1))
</script>
