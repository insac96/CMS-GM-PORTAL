<template>
  <UiContent title="User Level" sub="Quản lý cấp độ tài khoản">
    <!-- <UiFlex justify="end" class="mb-4">
      <UButton color="gray" @click="modal.add = true">Thêm mới</UButton>
    </UiFlex> -->
    
    <!-- Table -->
    <UCard :ui="{ body: { padding: 'p-0 sm:p-0' } }">
      <LoadingTable v-if="loading.load" />

      <UTable :columns="selectedColumns" :rows="list">
        <template #title-data="{ row }">
          <UBadge color="gray" variant="soft">{{ row.title }}</UBadge>
        </template>

        <template #actions-data="{ row }">
          <UDropdown :items="actions(row)">
            <UButton color="gray" icon="i-bx-dots-horizontal-rounded" />
          </UDropdown>
        </template>
      </UTable>
    </UCard>

    <!-- Modal Add -->
    <UModal v-model="modal.add" preventClose>
      <UForm :state="stateAdd" @submit="addAction" class="p-4">
        <UFormGroup label="Cấp">
          <UInput v-model="stateAdd.number" type="number" />
        </UFormGroup>

        <UFormGroup label="Danh hiệu">
          <UInput v-model="stateAdd.title" />
        </UFormGroup>

        <UFormGroup label="Tu vi">
          <UInput v-model="stateAdd.exp" type="number" />
        </UFormGroup>

        <UFormGroup label="Giới hạn chat">
          <UInput v-model="stateAdd.limit.chat" type="number" />
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
        <UFormGroup label="Danh hiệu">
          <UInput v-model="stateEdit.title" />
        </UFormGroup>

        <UFormGroup label="Tu vi">
          <UInput v-model="stateEdit.exp" type="number" />
        </UFormGroup>

        <UFormGroup label="Giới hạn chat">
          <UInput v-model="stateEdit.limit.chat" type="number" />
        </UFormGroup>

        <UiFlex justify="end" class="mt-4">
          <UButton type="submit" :loading="loading.edit">Sửa</UButton>
          <UButton color="gray" @click="modal.edit = false" :disabled="loading.edit" class="ml-1">Đóng</UButton>
        </UiFlex>
      </UForm>
    </UModal>

    <!-- Modal Role -->
    <UModal v-model="modal.role" preventClose>
      <UForm :state="stateRole" @submit="roleAction" class="p-4">
        <UFormGroup label="Trang phục">
          <SelectRoleBody v-model="stateRole.role.body" />
        </UFormGroup>

        <UFormGroup label="Cánh">
          <SelectRoleWing v-model="stateRole.role.wing" />
        </UFormGroup>

        <UFormGroup label="Thú cưng">
          <SelectRolePet v-model="stateRole.role.pet" />
        </UFormGroup>

        <UiFlex justify="end" class="mt-4">
          <UButton type="submit" :loading="loading.role">Sửa</UButton>
          <UButton color="gray" @click="modal.role = false" :disabled="loading.role" class="ml-1">Đóng</UButton>
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
    key: 'number',
    label: 'Cấp',
  },{
    key: 'title',
    label: 'Danh hiệu',
  },{
    key: 'exp',
    label: 'Tu vi'
  },{
    key: 'limit.chat',
    label: 'Chat'
  },{
    key: 'actions',
    label: 'Chức năng',
  }
]
const selectedColumns = ref([...columns])

// Page
const page = ref({
})

// State
const stateAdd = ref({
  number: null,
  title: null,
  exp: null,
  limit: {
    chat: null
  }
})
const stateEdit = ref({
  _id: null,
  title: null,
  exp: null,
  limit: {
    chat: null
  }
})
const stateRole = ref({
  _id: null,
  role: {
    body: null,
    wing: null,
    pet: null,
  }
})

// Modal
const modal = ref({
  add: false,
  edit: false,
  role: false
})

watch(() => modal.value.add, (val) => !val && (stateAdd.value = {
  number: null,
  title: null,
  exp: null,
  limit: {
    chat: null
  }
}))

// Loading
const loading = ref({
  load: true,
  add: false,
  edit: false,
  role: false
})

// Actions
const actions = (row) => [
  [{
    label: 'Sửa thông tin',
    icon: 'i-bxs-pencil',
    click: () => {
      Object.keys(stateEdit.value).forEach(key => stateEdit.value[key] = row[key])
      modal.value.edit = true
    }
  },{
    label: 'Thêm ngoại hình',
    icon: 'i-bxs-universal-access',
    click: () => {
      stateRole.value._id = row._id
      stateRole.value.role.body = row.role ? row.role.body : null
      stateRole.value.role.wing = row.role ? row.role.wing : null
      stateRole.value.role.pet = row.role ? row.role.pet : null
      modal.value.role = true
    }
  }]
]
 
// Fetch
const getList = async () => {
  try {
    loading.value.load = true
    const data = await useAPI('user/manage/level/list', JSON.parse(JSON.stringify(page.value)))

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
    await useAPI('user/manage/level/add', JSON.parse(JSON.stringify(stateAdd.value)))

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
    await useAPI('user/manage/level/edit', JSON.parse(JSON.stringify(stateEdit.value)))

    loading.value.edit = false
    modal.value.edit = false
    getList()
  }
  catch (e) {
    loading.value.edit = false
  }
}

const roleAction = async () => {
  try {
    loading.value.role = true
    await useAPI('user/manage/level/role', JSON.parse(JSON.stringify(stateRole.value)))

    loading.value.role = false
    modal.value.role = false
    getList()
  }
  catch (e) {
    loading.value.role = false
  }
}

getList()
</script>
