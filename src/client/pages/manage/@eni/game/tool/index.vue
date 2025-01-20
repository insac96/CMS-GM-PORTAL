<template>
  <UiContent title="Game Tool" sub="Quản lý các trò chơi Tool">
    <UiFlex class="mb-4 gap-1" wrap>
      <USelectMenu v-model="page.size" :options="[5,10,20,50,100]" />
      
      <UForm :state="page" @submit="page.current = 1, getList()">
        <UInput v-model="page.search.key" placeholder="Tìm kiếm..." icon="i-bx-search" size="sm" />
      </UForm>

      <SelectGamePlatform v-model="page.platform" multiple size="sm"/>

      <SelectGameCategory v-model="page.category" multiple size="sm"/>

      <UButton color="gray" @click="modal.add = true" class="ml-auto">Thêm mới</UButton>
    </UiFlex>
    
    <!-- Table -->
    <UCard :ui="{ body: { padding: 'p-0 sm:p-0' } }">
      <LoadingTable v-if="loading.load" />

      <UTable 
        v-model:sort="page.sort"
        :columns="selectedColumns" 
        :rows="list"
      >
        <template #name-data="{ row }">
          <NuxtLink :to="`/game/tool/${row.key}`" target="_blank" class="text-primary font-semibold">{{ row.name }}</NuxtLink>
        </template>

        <template #platform-data="{ row }">
          <UBadge color="gray" variant="soft">{{ row.platform.name }}</UBadge>
        </template>

        <template #category-data="{ row }">
          <UBadge color="gray" variant="soft">{{ row.category.name }}</UBadge>
        </template>

        <template #coin-data="{ row }">
          {{ useMoney().toMoney(row.coin) }}
        </template>

        <template #ip-data="{ row }">
          {{ row.ip || '...' }}
        </template>

        <template #pin-data="{ row }">
          <UBadge :color="!!row.pin ? 'green' : 'gray'" variant="soft">{{ !!row.pin ? 'Đã ghim' : 'Không' }}</UBadge>
        </template>

        <template #display-data="{ row }">
          <UBadge :color="!!row.display ? 'green' : 'gray'" variant="soft">{{ !!row.display ? 'Hiện' : 'Ẩn' }}</UBadge>
        </template>

        <template #updatedAt-data="{ row }">
          {{ useDayJs().displayFull(row.updatedAt) }}
        </template>

        <template #actions-data="{ row }">
          <ManageGameToolAction :game="row" @update="getList" />
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
        <UFormGroup label="Nền tảng">
          <SelectGamePlatform v-model="stateAdd.platform" />
        </UFormGroup>

        <UFormGroup label="Danh mục">
          <SelectGameCategory v-model="stateAdd.category" />
        </UFormGroup>

        <UFormGroup label="Tên">
          <UInput v-model="stateAdd.name" />
        </UFormGroup>

        <UFormGroup label="Mã dự án">
          <UInput v-model="stateAdd.code" />
        </UFormGroup>

        <UFormGroup label="Mô tả ngắn">
          <UInput v-model="stateAdd.description" />
        </UFormGroup>

        <UFormGroup label="Hiển thị">
          <SelectDisplay v-model="stateAdd.display" />
        </UFormGroup>

        <UiFlex justify="end" class="mt-4">
          <SelectPin v-model="stateAdd.pin" class="mr-auto" />

          <UButton type="submit" :loading="loading.add">Thêm</UButton>
          <UButton color="gray" @click="modal.add = false" :disabled="loading.add" class="ml-1">Đóng</UButton>
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
    key: 'name',
    label: 'Tên',
  },{
    key: 'platform',
    label: 'Nền tảng',
  },{
    key: 'category',
    label: 'Thể loại'
  },{
    key: 'coin',
    label: 'Doanh thu',
    sortable: true
  },{
    key: 'ip',
    label: 'IP'
  },{
    key: 'pin',
    label: 'Ghim',
    sortable: true
  },{
    key: 'display',
    label: 'Hiển thị',
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
  search: {
    key: null,
  },
  platform: [],
  category: [],
  total: 0
})
watch(() => page.value.size, () => getList())
watch(() => page.value.current, () => getList())
watch(() => page.value.sort.column, () => getList())
watch(() => page.value.sort.direction, () => getList())
watch(() => page.value.platform, () => getList())
watch(() => page.value.category, () => getList())
watch(() => page.value.search.key, (val) => !val && getList())

// State
const stateAdd = ref({
  platform: null,
  category: null,
  name: null,
  code: null,
  description: null,
  pin: false,
  display: true,
})

// Modal
const modal = ref({
  add: false
})

watch(() => modal.value.add, (val) => !val && (stateAdd.value = {
  platform: null,
  category: null,
  name: null,
  code: null,
  description: null,
  pin: false,
  display: true,
}))

// Loading
const loading = ref({
  load: true,
  add: false
})

// Fetch
const getList = async () => {
  try {
    loading.value.load = true
    const data = await useAPI('game/tool/manage/project/list', JSON.parse(JSON.stringify(page.value)))

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
    await useAPI('game/tool/manage/project/add', JSON.parse(JSON.stringify(stateAdd.value)))

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
  