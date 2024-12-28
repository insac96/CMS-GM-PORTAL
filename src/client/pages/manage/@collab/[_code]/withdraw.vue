<template>
  <UiContent title="Withdraw" sub="Lịch sử rút tiền">
    <UiFlex class="mb-4 gap-1">
      <USelectMenu v-model="page.size" :options="[5,10,20,50,100]"/>

      <UForm :state="page" @submit="page.current = 1, getList()">
        <UiFlex class="gap-1">
          <UInput v-model="page.search.key" placeholder="Tìm kiếm..." icon="i-bx-search" size="sm"/>
        </UiFlex>
      </UForm>

      <UButton class="ml-auto" @click="openCreate">Tạo lệnh</UButton>
    </UiFlex>
    
    <!-- Table -->
    <UCard :ui="{ body: { padding: 'p-0 sm:p-0' } }">
      <LoadingTable v-if="loading.load" />

      <UTable 
        v-model:sort="page.sort"
        :columns="selectedColumns"
        :rows="list"
      >
        <template #code-data="{ row }">
          <UiText weight="semibold" class="uppercase" color="primary">{{ row.code }}</UiText>
        </template>

        <template #money-data="{ row }">
          <UiText weight="semibold">{{ useMoney().toMoney(row.money) }}</UiText>
        </template>

        <template #status-data="{ row }">
          <UBadge :color="statusFormat[row.status].color" variant="soft">
            {{ statusFormat[row.status].label }}
          </UBadge>
        </template>

        <template #[`verify.time-data`]="{ row }">
          {{ row.verify.time ? useDayJs().displayFull(row.verify.time) : '...' }}
        </template>

        <template #createdAt-data="{ row }">
          {{ useDayJs().displayFull(row.createdAt) }}
        </template>
      </UTable>
    </UCard>

    <!-- Pagination -->
    <UiFlex justify="between" class="py-4">
      <USelectMenu v-model="selectedColumns" :options="columns" multiple placeholder="Chọn cột" />
      <UPagination v-model="page.current" :page-count="page.size" :total="page.total" :max="4" />
    </UiFlex>

    <!-- Modal Create -->
    <UModal v-model="modal.create" preventClose>
      <UForm :state="stateCreate" @submit="createAction" class="p-4">
        <UFormGroup label="Số dư">
          <UInput :model-value="useMoney().toMoney(collab.money)" />
        </UFormGroup>

        <UFormGroup label="Số tiền rút">
          <UInput v-model="stateCreate.money" type="number" />
        </UFormGroup>

        <UFormGroup label="Ngân hàng">
          <UInput v-model="stateCreate.bank.name" />
        </UFormGroup>

        <UFormGroup label="Số tài khoản">
          <UInput v-model="stateCreate.bank.number" />
        </UFormGroup>

        <UFormGroup label="Người hưởng thụ">
          <UInput v-model="stateCreate.bank.person" />
        </UFormGroup>

        <UiFlex justify="end" class="mt-4">
          <UButton type="submit" :loading="loading.create">Thêm</UButton>
          <UButton color="gray" @click="modal.create = false" :disabled="loading.create" class="ml-1">Đóng</UButton>
        </UiFlex>
      </UForm>
    </UModal>
  </UiContent>
</template>

<script setup>
const route = useRoute()

// List
const list = ref([])
const collab = ref(undefined)

// Columns
const columns = [
  {
    key: 'code',
    label: 'Mã',
  },{
    key: 'money',
    label: 'Số tiền rút',
    sortable: true
  },{
    key: 'bank.name',
    label: 'Ngân hàng',
  },{
    key: 'bank.number',
    label: 'Số tài khoản'
  },{
    key: 'bank.person',
    label: 'Người hưởng thụ',
  },{
    key: 'status',
    label: 'Trạng thái',
    sortable: true
  },{
    key: 'verify.time',
    label: 'Ngày duyệt',
    sortable: true
  },{
    key: 'createdAt',
    label: 'Ngày tạo',
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
  total: 0,
  search: {
    key: null,
    by: 'CODE'
  },
  collab: route.params._code
})
watch(() => page.value.size, () => getList())
watch(() => page.value.current, () => getList())
watch(() => page.value.sort.column, () => getList())
watch(() => page.value.sort.direction, () => getList())
watch(() => page.value.search.key, (val) => !val && getList())

// Modal
const modal = ref({
  create: false
})

// Loading
const loading = ref({
  load: true,
  create: false
})

// State
const stateCreate = ref({
  money: null,
  bank: {
    name: null,
    number: null,
    person: null,
  },
  collab: route.params._code
})

watch(() => modal.value.create, (val) => !val && (stateCreate.value = {
  money: null,
  bank: {
    name: null,
    number: null,
    person: null,
  },
  collab: route.params._code
}))

// Status
const statusFormat = {
  0: { label: 'Đang chờ', color: 'orange' },
  1: { label: 'Thành công', color: 'green' },
  2: { label: 'Từ chối', color: 'red' },
}

// Fetch
const openCreate = async () => {
  await getCollab()
  modal.value.create = true
}

const getCollab = async () => {
  try {
    const data = await useAPI('collab/manage/code/get', { code: route.params._code })
    collab.value = data
  }
  catch(e){
    collab.value = null
  }
}

const createAction = async () => {
  try {
    loading.value.create = true
    await useAPI('collab/manage/code/withdraw/create', JSON.parse(JSON.stringify(stateCreate.value)))

    await getCollab()
    loading.value.create = false
    modal.value.create = false
  }
  catch (e) {
    loading.value.create = false
  } 
}

const getList = async () => {
  try {
    loading.value.load = true
    const data = await useAPI('collab/manage/code/withdraw/list', JSON.parse(JSON.stringify(page.value)))

    list.value = data.list
    page.value.total = data.total
    await getCollab()

    loading.value.load = false
  }
  catch (e) {
    loading.value.load = false
  } 
}

getList()
</script>
