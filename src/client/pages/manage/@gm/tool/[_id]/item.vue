<template>
  <UiContent title="Vật Phẩm" sub="Danh sách vật phẩm trò chơi">
    <UiFlex class="mb-4 gap-1">
      <USelectMenu v-model="page.size" :options="[5,10,20,50,100]"/>
      <UForm :state="page" @submit="page.current = 1, getList()" class="mr-auto">
        <UInput v-model="page.search" placeholder="Tìm kiếm..." icon="i-bx-search" size="sm" />
      </UForm>

      <UButton color="gray" @click="modal.single = true">Thêm mới</UButton>
      <UButton color="primary" @click="modal.multiple = true">Thêm hàng loạt</UButton>
      <UButton color="green" :loading="loading.export" @click="exportfile('json')">Xuất JSON</UButton>
    </UiFlex>
    
    <!-- Table -->
    <UCard :ui="{ body: { padding: 'p-0 sm:p-0' } }">
      <LoadingTable v-if="loading.load" />

      <UTable 
        v-model:sort="page.sort"
        :columns="selectedColumns" 
        :rows="list"
      >
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
      <UPagination v-model="page.current" :page-count="page.size" :total="page.total" :max="5" />
    </UiFlex>

    <!-- Modal Multiple -->
    <UModal v-model="modal.multiple" preventClose>
      <UForm :state="stateMultiple" @submit="multipleAction" class="p-4">
        <UFormGroup label="File Vật Phẩm">
          <UiUploadJson v-model="stateMultiple.items">
            <template #default="{ select, loading : loadingFile }">
              <UInput icon="i-bx-box" placeholder="Bấm vào đây để tải file JSON" :model-value="stateMultiple.items" :loading="loadingFile" :disabled="loading.multiple" readonly @click="select"/>
            </template>
          </UiUploadJson>
        </UFormGroup>

        <UiFlex justify="end" class="mt-4">
          <UButton type="submit" :loading="loading.multiple">Thêm</UButton>
          <UButton color="gray" @click="modal.multiple = false" :disabled="loading.multiple" class="ml-1">Đóng</UButton>
        </UiFlex>
      </UForm>
    </UModal>

    <!-- Modal Single -->
    <UModal v-model="modal.single" preventClose>
      <UForm :state="stateSingle" @submit="singleAction" class="p-4">
        <UFormGroup label="ID">
          <UInput v-model="stateSingle.item_id" />
        </UFormGroup>

        <UFormGroup label="Tên">
          <UInput v-model="stateSingle.item_name" />
        </UFormGroup>

        <UiFlex justify="end" class="mt-4">
          <UButton type="submit" :loading="loading.single">Thêm</UButton>
          <UButton color="gray" @click="modal.single = false" :disabled="loading.single" class="ml-1">Đóng</UButton>
        </UiFlex>
      </UForm>
    </UModal>

    <!-- Modal Edit -->
    <UModal v-model="modal.edit" preventClose>
      <UForm :state="stateEdit" @submit="editAction" class="p-4">
        <UFormGroup label="ID">
          <UInput v-model="stateEdit.item_id" />
        </UFormGroup>

        <UFormGroup label="Tên">
          <UInput v-model="stateEdit.item_name" />
        </UFormGroup>

        <UiFlex justify="end" class="mt-4">
          <UButton type="submit" :loading="loading.edit">Thêm</UButton>
          <UButton color="gray" @click="modal.edit = false" :disabled="loading.edit" class="ml-1">Đóng</UButton>
        </UiFlex>
      </UForm>
    </UModal>
  </UiContent>
</template>

<script setup>
const game = useAttrs().game

// List
const list = ref([])

// Columns
const columns = [
	{
    key: 'item_id',
    label: 'Mã vật phẩm',
    sortable: true
  },{
    key: 'item_name',
    label: 'Tên vật phẩm',
    sortable: true
  },{
    key: 'actions',
    label: 'Chức năng',
  }
]
const selectedColumns = ref([...columns])

// Page
const page = ref({
  size: 5,
  current: 1,
  sort: {
    column: 'item_id',
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

// State
const stateMultiple = ref({
  items: null,
  game: game._id
})

const stateSingle = ref({
  item_id: null, 
  item_name: null,
  game: game._id
})

const stateEdit = ref({
  _id: null,
  item_id: null, 
  item_name: null,
  game: game._id
})

// Modal
const modal = ref({
  single: false,
  multiple: false,
  edit: false
})
watch(() => modal.value.multiple, (val) => !val && (stateMultiple.value = {
  items: null,
  game: game._id
}))
watch(() => modal.value.single, (val) => !val && (stateSingle.value = {
  item_id: null, 
  item_name: null,
  game: game._id
}))

// Loading
const loading = ref({
  load: true,
  single: false,
  multiple: false,
  edit: false,
  del: false,
  export: false
})

// Actions
const actions = (row) => [
  [{
    label: 'Sửa vật phẩm',
    icon: 'i-bx-pencil',
    click: () => {
      Object.keys(stateEdit.value).forEach(key => stateEdit.value[key] = row[key])
      stateEdit.value.game = game._id
      modal.value.edit = true
    }
  }],[{
    label: 'Xóa vật phẩm',
    icon: 'i-bx-trash',
    click: () => delAction(row._id)
  }]
]
 
// Fetch
const getList = async () => {
  try {
    loading.value.load = true
    const data = await useAPI('game/tool/manage/item/list', JSON.parse(JSON.stringify(page.value)))

    loading.value.load = false
    list.value = data.list
    page.value.total = data.total
  }
  catch (e) {
    loading.value.load = false
  } 
}

const multipleAction = async () => {
  try {
    loading.value.multiple = true
    await useAPI('game/tool/manage/item/add/multiple', JSON.parse(JSON.stringify(stateMultiple.value)))

    loading.value.multiple = false
    modal.value.multiple = false
    getList()
  }
  catch (e) {
    loading.value.multiple = false
  }
}

const singleAction = async () => {
  try {
    loading.value.single = true
    await useAPI('game/tool/manage/item/add/single', JSON.parse(JSON.stringify(stateSingle.value)))

    loading.value.single = false
    modal.value.single = false
    getList()
  }
  catch (e) {
    loading.value.single = false
  }
}

const editAction = async () => {
  try {
    loading.value.edit = true
    await useAPI('game/tool/manage/item/edit', JSON.parse(JSON.stringify(stateEdit.value)))

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
    await useAPI('game/tool/manage/item/del', {
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

const exportfile = async (type) => {
  try {
    loading.value.export = true
    const file = await useAPI('game/tool/manage/item/export', {
			game: game._id,
      type: type
		})

    fetch(file.url)
    .then(response => {
      return response.json()
    })
    .then(data => {
      const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      a.click();
      URL.revokeObjectURL(url);
    })

    loading.value.export = false
  }
  catch (e) {
    loading.value.export = false
  }
}

onMounted(() => setTimeout(getList, 1))
</script>
