<template>
  <div>
    <UiFlex class="mb-4 gap-1">
      <USelectMenu v-model="page.size" :options="[5,10,20,50,100]"/>
      <UForm :state="page" @submit="page.current = 1, getList()" class="mr-auto">
        <UInput v-model="page.search" placeholder="Tìm kiếm..." icon="i-bx-search" size="sm" />
      </UForm>

      <UButton color="gray" @click="modal.add = true" class="ml-1">Tạo mới</UButton>
    </UiFlex>
    
    <!-- Table -->
    <UCard :ui="{ body: { padding: 'p-0 sm:p-0' } }">
      <LoadingTable v-if="loading.load" />

      <UTable 
        v-model:sort="page.sort"
        :columns="selectedColumns" 
        :rows="list"
      >
      </UTable>
    </UCard>

    <!-- Pagination -->
    <UiFlex justify="between" class="py-4">
      <USelectMenu v-model="selectedColumns" :options="columns" multiple placeholder="Chọn cột" />
      <UPagination v-model="page.current" :page-count="page.size" :total="page.total" :max="5" />
    </UiFlex>

    <!-- Modal Add -->
    <UModal v-model="modal.add" preventClose>
      <UForm :state="stateAdd" @submit="addAction" class="p-4">
        <UFormGroup label="File Vật Phẩm">
          <UiUploadJson v-model="stateAdd.items">
            <template #default="{ select, loading : loadingFile }">
              <UInput icon="i-bx-box" placeholder="Bấm vào đây để tải file JSON" :model-value="stateAdd.items" :loading="loadingFile" :disabled="loading.add" readonly @click="select"/>
            </template>
          </UiUploadJson>
        </UFormGroup>

        <UiFlex justify="end" class="mt-6">
          <UButton type="submit" :loading="loading.add">Thêm</UButton>
          <UButton color="gray" @click="modal.add = false" :disabled="loading.add" class="ml-1">Đóng</UButton>
        </UiFlex>
      </UForm>
    </UModal>
  </div>
</template>

<script setup>
const props = defineProps(['game'])

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
  game: props.game
})
watch(() => page.value.size, () => getList())
watch(() => page.value.current, () => getList())
watch(() => page.value.sort.column, () => getList())
watch(() => page.value.sort.direction, () => getList())
watch(() => page.value.search, (val) => !val && getList())

// State
const stateAdd = ref({
  items: null,
  game: props.game
})

// Modal
const modal = ref({
  add: false
})

// Loading
const loading = ref({
  load: true,
  add: false
})
 
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

const addAction = async () => {
  try {
    loading.value.add = true
    await useAPI('game/tool/manage/item/add', JSON.parse(JSON.stringify(stateAdd.value)))

    loading.value.add = false
    modal.value.add = false
    getList()
  }
  catch (e) {
    loading.value.add = false
  }
}

getList()
</script>
