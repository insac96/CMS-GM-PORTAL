<template>
  <UiContent title="Collab" sub="Quản lý Nguồn Cộng Tác Viên">
    <UiFlex class="mb-4">
      <USelectMenu v-model="page.size" :options="[5,10,20,50,100]" class="mr-2"/>
      <UForm :state="page" @submit="page.current = 1, getList()" class="mr-auto">
        <UInput v-model="page.search" placeholder="Tìm kiếm..." icon="i-bx-search" size="sm" />
      </UForm>
      <UButton color="gray" @click="modal.add = true" class="ml-2">Thêm mới</UButton>
    </UiFlex>
    
    <!-- Table -->
    <UCard :ui="{ body: { padding: 'p-0 sm:p-0' } }">
      <LoadingTable v-if="loading.load" />

      <UTable 
        v-model:sort="page.sort"
        :columns="selectedColumns" 
        :rows="list"
      >
        <template #level-data="{ row }">
          {{ row.level.number }}
        </template>

        <template #url-data="{ row }">
          <NuxtLink :to="useMakeLink().web(`https://${row.code}.${runtimeConfig.public.domain}`)" target="_blank" class="text-primary font-semibold">
            {{ useMakeLink().web(`https://${row.code}.${runtimeConfig.public.domain}`) }}
          </NuxtLink>
        </template>

        <template #code-data="{ row }">
          <UBadge color="gray">{{ row.code }}</UBadge>
        </template>

        <template #user-data="{ row }">
          <UBadge color="gray">{{ !!row.user ? row.user.username : '...' }}</UBadge>
        </template>

        <template #pay-data="{ row }">
          {{ useMoney().toMoney(row.pay || 0) }}
        </template>

        <template #updatedAt-data="{ row }">
          {{ useDayJs().displayFull(row.updatedAt) }}
        </template>

        <template #actions-data="{ row }">
          <UiFlex>
            <UDropdown :items="actions(row)">
              <UButton color="gray" icon="i-bx-dots-horizontal-rounded" :disabled="loading.del"/>
            </UDropdown>
          </UiFlex>
        </template>
      </UTable>
    </UCard>

    <!-- Pagination -->
    <UiFlex justify="between" class="py-4">
      <USelectMenu v-model="selectedColumns" :options="columns" multiple placeholder="Chọn cột" />
      <UPagination v-model="page.current" :page-count="page.size" :total="page.total" />
    </UiFlex>

    <!-- Modal Add -->
    <UModal v-model="modal.add" preventClose>
      <UForm :state="stateAdd" @submit="addAction" class="p-4">
        <UFormGroup label="Cấp">
          <SelectCollabLevel v-model="stateAdd.level" />
        </UFormGroup>

        <UFormGroup label="Code">
          <UInput v-model="stateAdd.code" />
        </UFormGroup>

        <UFormGroup label="Tài khoản">
          <SelectUser v-model="stateAdd.user" />
        </UFormGroup>

        <UFormGroup label="Ghi chú">
          <UInput v-model="stateAdd.note" />
        </UFormGroup>

        <UiFlex justify="end" class="mt-6">
          <UButton type="submit" :loading="loading.add">Thêm</UButton>
          <UButton color="gray" @click="modal.add = false" :disabled="loading.add" class="ml-1">Đóng</UButton>
        </UiFlex>
      </UForm>
    </UModal>

    <!-- Modal Edit -->
    <UModal v-model="modal.edit" preventClose>
      <UForm :state="stateEdit" @submit="editAction" class="p-4">
        <UFormGroup label="Cấp">
          <SelectCollabLevel v-model="stateEdit.level" />
        </UFormGroup>

        <UFormGroup label="Code">
          <UInput v-model="stateEdit.code" />
        </UFormGroup>

        <UFormGroup label="Ghi chú">
          <UInput v-model="stateEdit.note" />
        </UFormGroup>

        <UiFlex justify="end" class="mt-6">
          <UButton type="submit" :loading="loading.edit">Sửa</UButton>
          <UButton color="gray" @click="modal.edit = false" :disabled="loading.edit" class="ml-1">Đóng</UButton>
        </UiFlex>
      </UForm>
    </UModal>
  </UiContent>
</template>

<script setup>
// List
const runtimeConfig = useRuntimeConfig()
const list = ref([])

// Columns
const columns = [
  {
    key: 'level',
    label: 'Cấp',
  },{
    key: 'code',
    label: 'Mã',
  },{
    key: 'url',
    label: 'Đường dẫn',
  },{
    key: 'user',
    label: 'Tài khoản',
  },{
    key: 'note',
    label: 'Ghi chú',
  },{
    key: 'view',
    label: 'Truy cập',
    sortable: true
  },{
    key: 'pay',
    label: 'Nạp tiền',
    sortable: true
  },{
    key: 'updatedAt',
    label: 'Cập nhật',
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
    column: 'updatedAt',
    direction: 'desc'
  },
  search: null,
  total: 0
})
watch(() => page.value.size, () => getList())
watch(() => page.value.current, () => getList())
watch(() => page.value.sort.column, () => getList())
watch(() => page.value.sort.direction, () => getList())
watch(() => page.value.search, (val) => !val && getList())

// State
const stateAdd = ref({
  level: null,
  code: null,
  user: null,
  note: null,
})
const stateEdit = ref({
  _id: null,
  level: null,
  code: null,
  note: null,
})

// Modal
const modal = ref({
  add: false,
  edit: false
})

watch(() => modal.value.add, (val) => !val && (stateAdd.value = {
  code: null,
  user: null,
  note: null
}))

// Loading
const loading = ref({
  load: true,
  add: false,
  edit: false,
  del: false
})

// Actions
const actions = (row) => [
  [{
    label: 'Quản lý',
    icon: 'i-bxs-bar-chart-alt-2',
    click: () => useTo().openNewTab(`/manage/@collab/${row.code}`)
  }],
  [{
    label: 'Sửa thông tin',
    icon: 'i-bx-pencil',
    click: () => {
      Object.keys(stateEdit.value).forEach(key => stateEdit.value[key] = row[key])
      stateEdit.value.level = row.level._id
      modal.value.edit = true
    }
  }],[{
    label: 'Xóa cộng tác viên',
    icon: 'i-bx-trash',
    click: () => delAction(row._id)
  }]
]
 
// Fetch
const getList = async () => {
  try {
    loading.value.load = true
    const data = await useAPI('collab/manage/list', JSON.parse(JSON.stringify(page.value)))

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
    await useAPI('collab/manage/add', JSON.parse(JSON.stringify(stateAdd.value)))

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
    await useAPI('collab/manage/edit', JSON.parse(JSON.stringify(stateEdit.value)))

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
    await useAPI('collab/manage/del', { _id })

    loading.value.del = false
    getList()
  }
  catch (e) {
    loading.value.del = false
  }
}

getList()
</script>
