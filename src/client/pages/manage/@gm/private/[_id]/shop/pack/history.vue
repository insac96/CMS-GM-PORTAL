<template>
  <UiContent title="Lịch Sử Mua Gói Vật Phẩm" sub="Giao dịch mua gói vật phẩm của người chơi" no-dot>
    <template #more>
			<UButton 
				icon="i-bx-list-ul" 
				size="xs" 
				class="ml-auto"
				:to="`/manage/@gm/private/${game._id}/shop/pack`"
			>
				Danh sách
			</UButton>
		</template>

    <UiFlex class="mb-4 gap-1">
      <USelectMenu v-model="page.size" :options="[5,10,20,50,100]" />
      <UForm :state="page" @submit="page.current = 1, getList()">
        <UInput v-model="page.search" placeholder="Tìm kiếm..." icon="i-bx-search" size="sm" />
      </UForm>
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
          <UBadge v-else variant="soft" color="gray" class="cursor-pointer" @click="viewUser(row.user.user._id)">
            {{ row.user.user.username }}
          </UBadge>
        </template>

				<template #pack-data="{ row }">
          {{ row.pack.name }}
        </template>

        <template #price-data="{ row }">
          <UiText weight="semibold">{{ toMoney(row.price) }}</UiText>
        </template>

				<template #amount-data="{ row }">
          {{ toMoney(row.amount) }}
        </template>

        <template #createdAt-data="{ row }">
          {{ useDayJs().displayFull(row.createdAt) }}
        </template>
      </UTable>
    </UCard>

    <!-- Pagination -->
    <UiFlex justify="between" class="mt-4">
      <USelectMenu v-model="selectedColumns" :options="columns" multiple placeholder="Chọn cột" />
      <UPagination v-model="page.current" :page-count="page.size" :total="page.total" :max="4" />
    </UiFlex>

    <!-- Modal User View -->
    <UModal v-model="modal.user" :ui="{width: 'sm:max-w-[900px]'}">
      <ManageUser :user="stateUser" />
    </UModal>
  </UiContent>
</template>

<script setup>
const authStore = useAuthStore()
const game = useAttrs().game
const { toMoney } = useMoney()

// List
const list = ref([])

// Columns
const columns = [
  {
    key: 'user',
    label: 'Người chơi',
  },{
    key: 'pack',
    label: 'Gói',
  },{
    key: 'amount',
    label: 'Số lượng',
		sortable: true
  },{
    key: 'price',
    label: 'Giá mua',
    sortable: true
  },{
    key: 'server',
    label: 'Máy chủ',
  },{
    key: 'role',
    label: 'Nhân vật',
  },{
    key: 'createdAt',
    label: 'Thời gian',
    sortable: true
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
  total: 0,
  game: game._id
})
watch(() => page.value.size, () => getList())
watch(() => page.value.current, () => getList())
watch(() => page.value.sort.column, () => getList())
watch(() => page.value.sort.direction, () => getList())
watch(() => page.value.search, (val) => !val && getList())

// Modal
const modal = ref({
  user: false,
})

// Loading
const loading = ref({
  load: true
})

// View User
const stateUser = ref(undefined)
const viewUser = (_id) => {
  if(!authStore.isAdmin) return
  stateUser.value = _id
  modal.value.user = true
}

// Fetch
const getList = async () => {
  try {
    loading.value.load = true
    const data = await useAPI('game/private/manage/shop/pack/history', JSON.parse(JSON.stringify(page.value)))

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
