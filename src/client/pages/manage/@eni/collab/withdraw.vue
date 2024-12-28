<template>
  <UiContent title="Withdraw" sub="Danh sách lệnh rút tiền">
    <UiFlex class="mb-4 gap-1">
      <USelectMenu v-model="page.size" :options="[5,10,20,50,100]"/>

      <UForm :state="page" @submit="page.current = 1, getList()">
        <UiFlex class="gap-1">
          <UInput v-model="page.search.key" placeholder="Tìm kiếm..." icon="i-bx-search" size="sm" />
          <USelectMenu v-model="page.search.by" :options="['CODE', 'USER', 'COLLAB']" />
        </UiFlex>
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
        <template #code-data="{ row }">
          <UiText weight="semibold" class="uppercase" color="primary">{{ row.code }}</UiText>
        </template>

        <template #collab-data="{ row }">
          <span v-if="!row.collab">...</span>
          <UBadge v-else variant="soft" color="gray">
            {{ row.collab.code }}
          </UBadge>
        </template>

        <template #user-data="{ row }">
          <span v-if="!row.user">...</span>
          <UBadge v-else variant="soft" color="gray" class="cursor-pointer" @click="viewUser(row.user._id)">
            {{ row.user.username }}
          </UBadge>
        </template>

        <template #money-data="{ row }">
          <UiText weight="semibold">{{ useMoney().toMoney(row.money) }}</UiText>
        </template>

        <template #status-data="{ row }">
          <UBadge :color="statusFormat[row.status].color" variant="soft">
            {{ statusFormat[row.status].label }}
          </UBadge>
        </template>

        <template #[`verify.person-data`]="{ row }">
          <span v-if="!row.verify.person">...</span>
          <UBadge v-else variant="soft" color="gray" class="cursor-pointer" @click="viewUser(row.verify.person._id)">
            {{ row.verify.person.username }}
          </UBadge>
        </template>

        <template #[`verify.time-data`]="{ row }">
          {{ row.verify.time ? useDayJs().displayFull(row.verify.time) : '...' }}
        </template>

        <template #createdAt-data="{ row }">
          {{ useDayJs().displayFull(row.createdAt) }}
        </template>

        <template #actions-data="{ row }">
          <UDropdown :items="actions(row)">
            <UButton color="gray" icon="i-bx-dots-horizontal-rounded"/>
          </UDropdown>
        </template>
      </UTable>
    </UCard>

    <!-- Pagination -->
    <UiFlex justify="between" class="py-4">
      <USelectMenu v-model="selectedColumns" :options="columns" multiple placeholder="Chọn cột" />
      <UPagination v-model="page.current" :page-count="page.size" :total="page.total" :max="4" />
    </UiFlex>

    <!-- Modal User View -->
    <UModal v-model="modal.user" :ui="{width: 'sm:max-w-[900px]'}">
      <ManageUser :user="stateUser" />
    </UModal>

    <!-- Modal Success -->
    <UModal v-model="modal.success" preventClose>
      <UForm :state="stateSuccess" @submit="successAction" class="p-4">
        <UFormGroup label="Mã giao dịch">
          <UInput :model-value="stateSuccess.code" readonly />
        </UFormGroup>

        <UFormGroup label="Ngân hàng">
          <UInput :model-value="stateSuccess.bank.name" readonly />
        </UFormGroup>

        <UFormGroup label="Số tài khoản">
          <UInput :model-value="stateSuccess.bank.number" readonly />
        </UFormGroup>

        <UFormGroup label="Người hưởng thụ">
          <UInput :model-value="stateSuccess.bank.person" readonly />
        </UFormGroup>

        <UFormGroup label="Số tiền">
          <UInput :model-value="useMoney().toMoney(stateSuccess.money)" type="number" />
        </UFormGroup>

        <UiFlex justify="end" class="mt-4">
          <UButton type="submit" :loading="loading.success">Duyệt</UButton>
          <UButton color="gray" @click="modal.success = false" :disabled="loading.success" class="ml-1">Đóng</UButton>
        </UiFlex>
      </UForm>
    </UModal>

    <!-- Modal Refuse -->
    <UModal v-model="modal.refuse" preventClose>
      <UForm :state="stateRefuse" @submit="refuseAction" class="p-4">
        <UFormGroup label="Mã giao dịch">
          <UInput :model-value="stateRefuse.code" readonly />
        </UFormGroup>

        <UFormGroup label="Lý do từ chối">
          <UTextarea v-model="stateRefuse.reason" />
        </UFormGroup>

        <UiFlex justify="end" class="mt-4">
          <UButton type="submit" :loading="loading.refuse" color="red">Từ chối</UButton>
          <UButton color="gray" @click="modal.refuse = false" :disabled="loading.refuse" class="ml-1">Đóng</UButton>
        </UiFlex>
      </UForm>
    </UModal>
  </UiContent>
</template>

<script setup>
// List
const list = ref([])

// Columns
const columns = [
  {
    key: 'code',
    label: 'Mã',
  },{
    key: 'collab',
    label: 'Mã CTV',
  },{
    key: 'user',
    label: 'Người tạo',
  },{
    key: 'money',
    label: 'Số tiền rút',
    sortable: true
  },{
    key: 'status',
    label: 'Trạng thái',
    sortable: true
  },{
    key: 'verify.person',
    label: 'Người duyệt',
  },{
    key: 'verify.time',
    label: 'Ngày duyệt',
    sortable: true
  },{
    key: 'createdAt',
    label: 'Ngày tạo',
    sortable: true
  },{
    key: 'actions',
    label: 'Chức năng',
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
  }
})
watch(() => page.value.size, () => getList())
watch(() => page.value.current, () => getList())
watch(() => page.value.sort.column, () => getList())
watch(() => page.value.sort.direction, () => getList())
watch(() => page.value.search.key, (val) => !val && getList())

// Modal
const modal = ref({
  success: false,
  refuse: false,
  user: false,
})

// Loading
const loading = ref({
  load: true,
  success: false,
  refuse: false,
})

// State
const stateSuccess = ref({
  _id: null,
  code: null,
  bank: {
    name: null,
    number: null,
    person: null,
  },
  money: null,
  status: null
})
const stateRefuse = ref({
  _id: null,
  code: null,
  reason: null,
  status: null
})
const stateUser = ref(undefined)

// Status
const statusFormat = {
  0: { label: 'Đang chờ', color: 'orange' },
  1: { label: 'Thành công', color: 'green' },
  2: { label: 'Từ chối', color: 'red' },
}

// Actions
const actions = (row) => [
  [{
    label: 'Duyệt',
    icon: 'i-bx-check',
    disabled: row.status > 0,
    click: () => {
      Object.keys(stateSuccess.value).forEach(key => stateSuccess.value[key] = row[key])
      stateSuccess.value.status = 1
      modal.value.success = true
    }
  }],[{
    label: 'Từ chối',
    icon: 'i-bx-x',
    disabled: row.status > 0,
    click: () => {
      Object.keys(stateRefuse.value).forEach(key => stateRefuse.value[key] = row[key])
      stateRefuse.value.status = 2
      modal.value.refuse = true
    }
  }]
]

const viewUser = (_id) => {
  stateUser.value = _id
  modal.value.user = true
}

// Fetch
const successAction = async () => {
  try {
    loading.value.success = true
    await useAPI('collab/manage/withdraw/verify', JSON.parse(JSON.stringify(stateSuccess.value)))

    loading.value.success = false
    modal.value.success = false
    getList()
  }
  catch (e) {
    loading.value.success = false
  }
}

const refuseAction = async () => {
  try {
    loading.value.refuse = true
    await useAPI('collab/manage/withdraw/verify', JSON.parse(JSON.stringify(stateRefuse.value)))

    loading.value.refuse = false
    modal.value.refuse = false
    getList()
  }
  catch (e) {
    loading.value.refuse = false
  }
}

const getList = async () => {
  try {
    loading.value.load = true
    const data = await useAPI('collab/manage/withdraw/list', JSON.parse(JSON.stringify(page.value)))

    list.value = data.list
    page.value.total = data.total
    loading.value.load = false
  }
  catch (e) {
    loading.value.load = false
  } 
}

getList()
</script>
