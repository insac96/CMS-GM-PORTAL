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

        <template #status-data="{ row }">
          <UBadge :color="statusFormat[row.status].color" variant="soft">
            {{ statusFormat[row.status].label }}
          </UBadge>
        </template>

        <template #createdAt-data="{ row }">
          {{ useDayJs().displayFull(row.createdAt) }}
        </template>

        <template #undo-data="{ row }">
          <UButton color="gray" size="xs" :disabled="row.status > 0" @click="openUndo(row)">{{ row.status > 0 ? '...' : 'Hủy' }}</UButton>
        </template>
      </UTable>

      <template #footer>
        <UiFlex justify="end">
          <UPagination class="ml-auto" v-model="page.current" :page-count="page.size" :total="page.total" :max="5" />
        </UiFlex>
      </template>
    </UCard>

    <!-- Modal Undo -->
    <UModal v-model="modal.undo" prevent-close>
      <UForm @submit="undoAction" class="p-4">
        <UFormGroup label="Mã giao dịch">
          <UInput :model-value="stateUndo.code" readonly />
        </UFormGroup>

        <UFormGroup label="Lý do hủy">
          <UTextarea v-model="stateUndo.reason" />
        </UFormGroup>

        <UiFlex justify="end" class="mt-4">
          <UButton type="submit" :loading="loading.undo">Xác nhận</UButton>
          <UButton color="gray" @click="modal.undo = false" :disabled="loading.undo" class="ml-1">Đóng</UButton>
        </UiFlex>
      </UForm>
    </UModal>
  </div>
</template>

<script setup>
const authStore = useAuthStore()

const props = defineProps(['user', 'game', 'reload'])

const loading = ref({
  load: true,
  undo: false
})

const modal = ref({
  undo: false
})

const list = ref([])

const columns = [
  {
    key: 'code',
    label: 'Mã',
  },{
    key: 'coin',
    label: 'Số xu',
    sortable: true
  },{
    key: 'status',
    label: 'Trạng thái',
    sortable: true
  },{
    key: 'createdAt',
    label: 'Ngày tạo',
    sortable: true
  },{
    key: 'undo',
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

const statusFormat = {
  0: { label: 'Đang chờ', color: 'orange' },
  1: { label: 'Thành công', color: 'green' },
  2: { label: 'Từ chối', color: 'red' },
  3: { label: 'Hoàn tác', color: 'blue' },
}

const stateUndo = ref({
  _id: null,
  code: null,
  reason: null,
  game: props.game
})

const openUndo = (row) => {
  stateUndo.value._id = row._id
  stateUndo.value.code = row.code
  modal.value.undo = true
}

const undoAction = async () => {
  try {
    loading.value.undo = true
    await useAPI('game/china/public/payment/undo', JSON.parse(JSON.stringify(stateUndo.value)))
    await authStore.setAuth()

    loading.value.undo = false
    modal.value.undo = false
    stateUndo.value.reason = null
    getList()
  }
  catch (e) {
    loading.value.undo = false
  }
}

const getList = async () => {
  try {
    loading.value.load = true
    const data = await useAPI('game/china/public/payment/history', JSON.parse(JSON.stringify(page.value)))

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