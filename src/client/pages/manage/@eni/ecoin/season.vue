<template>
  <UiContent title="Ecoin Season" sub="Quản lý các mùa giải Ecoin">
    <UiFlex class="mb-4">
      <USelectMenu v-model="page.size" :options="[5,10,20,50,100]" class="mr-auto"/>
      <UButton color="gray" @click="modal.add = true">Thêm mới</UButton>
    </UiFlex>
    
    <!-- Table -->
    <UCard :ui="{ body: { padding: 'p-0 sm:p-0' } }">
      <LoadingTable v-if="loading.load" />

      <UTable 
        v-model:sort="page.sort"
        :columns="selectedColumns" 
        :rows="list"
      >
        <template #[`time.start-data`]="{ row }">
          {{ useDayJs().displayTime(row.time.start) }}
        </template>

        <template #[`time.end-data`]="{ row }">
          {{ useDayJs().displayTime(row.time.end) }}
        </template>

        <template #vnd-data="{ row }">
          {{ useMoney().toMoney(row.vnd) }}
        </template>

        <template #ecoin-data="{ row }">
          {{ useMoney().toMoney(row.ecoin) }}
        </template>

        <template #active-data="{ row }">
          <UBadge :color="!!row.active ? 'green' : 'gray'" variant="soft">{{ !!row.active ? 'Đang hoạt động' : 'Không' }}</UBadge>
        </template>

        <template #actions-data="{ row }">
          <UDropdown :items="actions(row)">
            <UButton color="gray" icon="i-bx-dots-horizontal-rounded" :disabled="loading.del"/>
          </UDropdown>
        </template>
      </UTable>
    </UCard>

    <!-- Pagination -->
    <UiFlex justify="between" class="py-4">
      <USelectMenu v-model="selectedColumns" :options="columns" multiple placeholder="Chọn cột" />
      <UPagination v-model="page.current" :page-count="page.size" :total="page.total" :max="4" />
    </UiFlex>

    <!-- Modal Add -->
    <UModal v-model="modal.add" preventClose>
      <UForm :state="stateAdd" @submit="addAction" class="p-4">
        <UFormGroup label="Tên mùa giải">
          <UInput v-model="stateAdd.title" />
        </UFormGroup>

        <UFormGroup label="Tổng cung tiền">
          <UInput v-model="stateAdd.vnd" type="number" />
        </UFormGroup>

        <UFormGroup label="Số Ecoin sàn">
          <UInput v-model="stateAdd.ecoin" type="number" />
        </UFormGroup>

        <UFormGroup label="Thời gian bắt đầu">
          <SelectDate v-model="stateAdd.time.start" />
        </UFormGroup>

        <UFormGroup label="Thời gian kết thúc">
          <SelectDate v-model="stateAdd.time.end" />
        </UFormGroup>

        <UiFlex justify="end" class="mt-4">
          <UButton type="submit" :loading="loading.add">Thêm</UButton>
          <UButton color="gray" @click="modal.add = false" :disabled="loading.add" class="ml-1">Đóng</UButton>
        </UiFlex>
      </UForm>
    </UModal>

    <!-- Modal Edit -->
    <UModal v-model="modal.edit" preventClose>
      <UForm :state="stateEdit" @submit="editAction" class="p-4">
        <UFormGroup label="Tên mùa giải">
          <UInput v-model="stateEdit.title" />
        </UFormGroup>

        <UFormGroup label="Tổng cung tiền">
          <UInput v-model="stateEdit.vnd" type="number" />
        </UFormGroup>

        <UFormGroup label="Số Ecoin sàn">
          <UInput v-model="stateEdit.ecoin" type="number" />
        </UFormGroup>

        <UFormGroup label="Thời gian bắt đầu">
          <SelectDate v-model="stateEdit.time.start" />
        </UFormGroup>

        <UFormGroup label="Thời gian kết thúc">
          <SelectDate v-model="stateEdit.time.end" />
        </UFormGroup>

        <UiFlex justify="end" class="mt-4">
          <UButton type="submit" :loading="loading.edit">Sửa</UButton>
          <UButton color="gray" @click="modal.edit = false" :disabled="loading.edit" class="ml-1">Đóng</UButton>
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
    key: 'title',
    label: 'Tên',
  },{
    key: 'time.start',
    label: 'Bắt đầu',
    sortable: true
  },{
    key: 'time.end',
    label: 'Kết thúc',
    sortable: true
  },{
    key: 'vnd',
    label: 'Tổng cung tiền',
    sortable: true
  },{
    key: 'ecoin',
    label: 'Ecoin sàn',
    sortable: true
  },{
    key: 'active',
    label: 'Kích hoạt',
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
    column: 'active',
    direction: 'desc'
  },
  total: 0
})
watch(() => page.value.size, () => getList())
watch(() => page.value.current, () => getList())
watch(() => page.value.sort.column, () => getList())
watch(() => page.value.sort.direction, () => getList())

// State
const stateAdd = ref({
  title: null,
  time: {
    start: null,
    end: null,
  },
  ecoin: null,
  vnd: null
})

const stateEdit = ref({
  _id: null,
  title: null,
  time: {
    start: null,
    end: null,
  },
  ecoin: null,
  vnd: null
})

// Modal
const modal = ref({
  add: false,
  edit: false,
})

watch(() => modal.value.add, (val) => !val && (stateAdd.value = {
  title: null,
  time: {
    start: null,
    end: null,
  },
  ecoin: null,
  vnd: null
}))

// Loading
const loading = ref({
  load: true,
  add: false,
  edit: false,
  del: false,
  active: false
})

// Actions
const actions = (row) => [
  [{
    label: 'Kích hoạt',
    icon: 'i-bx-play-circle',
    click: () => activeAction(row._id)
  },{
    label: 'Sửa thông tin',
    icon: 'i-bx-pencil',
    click: () => {
      Object.keys(stateEdit.value).forEach(key => stateEdit.value[key] = row[key])
      modal.value.edit = true
    }
  }],
  [{
    label: 'Xóa mùa giải',
    icon: 'i-bx-trash',
    click: () => delAction(row._id)
  }]
]
 
// Fetch
const getList = async () => {
  try {
    loading.value.load = true
    const data = await useAPI('ecoin/manage/season/list', JSON.parse(JSON.stringify(page.value)))

    loading.value.load = false
    list.value = data.list
    page.value.total = data.total
  }
  catch (e) {
    loading.value.load = false
  } 
}

const addAction = async () => {
  try {
    loading.value.add = true
    await useAPI('ecoin/manage/season/add', JSON.parse(JSON.stringify(stateAdd.value)))

    loading.value.add = false
    modal.value.add = false
    getList()
  }
  catch (e) {
    loading.value.add = false
  }
}

const editAction = async () => {
  try {
    loading.value.edit = true
    await useAPI('ecoin/manage/season/edit', JSON.parse(JSON.stringify(stateEdit.value)))

    loading.value.edit = false
    modal.value.edit = false
    getList()
  }
  catch (e) {
    loading.value.edit = false
  }
}

const delAction = async (_id) => {
  try {
    loading.value.del = true
    await useAPI('ecoin/manage/season/del', { _id })

    loading.value.del = false
    getList()
  }
  catch (e) {
    loading.value.del = false
  }
}

const activeAction = async (_id) => {
  try {
    loading.value.active = true
    await useAPI('ecoin/manage/season/active', { _id })

    loading.value.active = false
    getList()
  }
  catch (e) {
    loading.value.active = false
  }
}

getList()
</script>
