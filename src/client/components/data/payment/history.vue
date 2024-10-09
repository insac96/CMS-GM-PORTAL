<template>
  <UiContent title="Lịch Sử Nạp" sub="Danh sách các giao dịch nạp Xu" class="p-4" no-dot>
    <div>
      <UiFlex>
        <USelectMenu v-model="page.size" :options="[5,10,20,50,100]" class="mr-1" />

        <UForm @submit="getList" class="max-w-[9rem] mr-auto">
          <UInput v-model="page.search.key" placeholder="Tìm kiếm..." icon="i-bx-search" size="sm"></UInput>
        </UForm>
        
        <SelectDate time v-model="page.range.start" placeholder="Bắt đầu" size="sm" class="ml-1 max-w-[140px]"/>
        <SelectDate time v-model="page.range.end" placeholder="Kết thúc" size="sm" class="ml-1 max-w-[140px]"/>
      </UiFlex>

      <LoadingTable v-if="loading.load" />

      <UTable v-model:sort="page.sort" :columns="columns" :rows="list">
        <template #code-data="{ row }">
          <UiText color="primary" weight="semibold" pointer @click="viewPayment(row._id)">{{ row.code }}</UiText>
        </template>

        <template #gate-data="{ row }">
          <UBadge variant="soft" color="gray">{{ row.gate.name }}</UBadge>
        </template>

        <template #money-data="{ row }">
          <UiText weight="semibold">{{ toMoney(row.money) }}</UiText>
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

      <UiFlex justify="between">
        <UButton color="gray" icon="i-bx-check" v-if="totalSuccess != 0">{{ toMoney(totalSuccess) }}</UButton>
        <UPagination class="ml-auto" v-model="page.current" :page-count="page.size" :total="page.total" :max="5" />
      </UiFlex>
    </div>

    <!-- Modal View -->
    <UModal v-model="modal.payment" prevent-close>
      <DataPaymentView :fetch-id="statePayment" />

      <div justify="end" class="px-4 pb-4">
        <UButton @click="modal.payment = false" block>Đóng</UButton>
      </div>
    </UModal>

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
  </UiContent>
</template>

<script setup>
const props = defineProps(['user', 'reload'])

const { toMoney } = useMoney()

const loading = ref({
  load: true,
  undo: false
})

const modal = ref({
  undo: false,
  payment: false
})

const list = ref([])

const columns = [
  {
    key: 'code',
    label: 'Mã',
  },{
    key: 'gate',
    label: 'Kênh',
  },{
    key: 'money',
    label: 'Số tiền',
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
  user: props.user || null
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
  reason: null
})
const statePayment = ref(undefined)

const openUndo = (row) => {
  stateUndo.value._id = row._id
  stateUndo.value.code = row.code
  modal.value.undo = true
}

const viewPayment = (_id) => {
  statePayment.value = _id
  modal.value.payment = true
}

const undoAction = async () => {
  try {
    loading.value.undo = true
    await useAPI('payment/public/undo', JSON.parse(JSON.stringify(stateUndo.value)))

    loading.value.undo = false
    modal.value.undo = false
    getList()
  }
  catch (e) {
    loading.value.undo = false
  }
}

// Total
const totalSuccess = computed(() => {
  if(list.value.length == 0) return 0

  let m = 0
  list.value.forEach(i => {
    if(i.status == 1) m = Number(m) + Number(i.money)
  })

  return m
})

const getList = async () => {
  try {
    loading.value.load = true
    const data = await useAPI('payment/public/history', JSON.parse(JSON.stringify(page.value)))

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