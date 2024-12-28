<template>
  <UiContent title="Collab Level" sub="Quản lý cấp độ cộng tác viên">
    <UiFlex justify="end" class="mb-4">
      <UButton color="gray" @click="modal.add = true">Thêm mới</UButton>
    </UiFlex>
    
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

        <UFormGroup label="Hoa hồng Nâng VIP">
          <UInput v-model="stateAdd.commission.vip" />
        </UFormGroup>

        <UFormGroup label="Hoa hồng Game Private">
          <UInput v-model="stateAdd.commission.game.private" type="number" />
        </UFormGroup>

        <UFormGroup label="Hoa hồng Game Tool">
          <UInput v-model="stateAdd.commission.game.tool" type="number" />
        </UFormGroup>

        <UFormGroup label="Hoa hồng Game China">
          <UInput v-model="stateAdd.commission.game.china" type="number" />
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
        <UFormGroup label="Hoa hồng Nâng VIP">
          <UInput v-model="stateEdit.commission.vip" />
        </UFormGroup>

        <UFormGroup label="Hoa hồng Game Private">
          <UInput v-model="stateEdit.commission.game.private" type="number" />
        </UFormGroup>

        <UFormGroup label="Hoa hồng Game Tool">
          <UInput v-model="stateEdit.commission.game.tool" type="number" />
        </UFormGroup>

        <UFormGroup label="Hoa hồng Game China">
          <UInput v-model="stateEdit.commission.game.china" type="number" />
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
    key: 'number',
    label: 'Cấp',
  },{
    key: 'commission.vip',
    label: 'Hoa hồng Nâng VIP',
  },{
    key: 'commission.game.private',
    label: 'Hoa hồng Game Private'
  },{
    key: 'commission.game.tool',
    label: 'Hoa hồng Game Tool'
  },{
    key: 'commission.game.china',
    label: 'Hoa hồng Game China'
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
  commission: {
    game: {
      private: 0,
      china: 0,
      tool: 0,
    },
    vip: 0
  }
})
const stateEdit = ref({
  _id: null,
  commission: {
    game: {
      private: null,
      china: null,
      tool: null,
    },
    vip: null
  }
})

// Modal
const modal = ref({
  add: false,
  edit: false
})

watch(() => modal.value.add, (val) => !val && (stateAdd.value = {
  number: null,
  commission: {
    game: {
      private: 0,
      china: 0,
      tool: 0,
    },
    vip: 0
  }
}))

// Loading
const loading = ref({
  load: true,
  add: false,
  edit: false,
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
  }]
]
 
// Fetch
const getList = async () => {
  try {
    loading.value.load = true
    const data = await useAPI('collab/manage/level/list', JSON.parse(JSON.stringify(page.value)))

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
    await useAPI('collab/manage/level/add', JSON.parse(JSON.stringify(stateAdd.value)))

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
    await useAPI('collab/manage/level/edit', JSON.parse(JSON.stringify(stateEdit.value)))

    loading.value.edit = false
    modal.value.edit = false
    getList()
  }
  catch (e) {
    loading.value.edit = false
  }
}

getList()
</script>
