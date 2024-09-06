<template>
    <UiContent title="Category" sub="Quản lý các thể loại trò chơi">
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
          <template #icon-data="{ row }">
            <UiIcon :name="row.icon" size="6" />
          </template>

          <template #count-data="{ row }">
            {{ useMoney().toMoney(row.count) }}
          </template>
  
          <template #createdAt-data="{ row }">
            {{ useDayJs().displayFull(row.createdAt) }}
          </template>
  
          <template #updatedAt-data="{ row }">
            {{ useDayJs().displayFull(row.updatedAt) }}
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
          <UFormGroup label="Tên">
            <UInput v-model="stateAdd.name" />
          </UFormGroup>
  
          <UFormGroup label="Biểu tượng">
            <UInput v-model="stateAdd.icon" />
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
          <UFormGroup label="Tên">
            <UInput v-model="stateEdit.name" />
          </UFormGroup>
  
          <UFormGroup label="Biểu tượng">
            <UInput v-model="stateEdit.icon" />
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
  const list = ref([])
  
  // Columns
  const columns = [
    {
      key: 'icon',
      label: 'Biểu tượng',
    },{
      key: 'name',
      label: 'Tên',
    },{
      key: 'count',
      label: 'Trò chơi',
      sortable: true
    },{
      key: 'createdAt',
      label: 'Ngày tạo',
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
    total: 0
  })
  watch(() => page.value.size, () => getList())
  watch(() => page.value.current, () => getList())
  watch(() => page.value.sort.column, () => getList())
  watch(() => page.value.sort.direction, () => getList())
  
  // State
  const stateAdd = ref({
    name: null,
    icon: null
  })
  const stateEdit = ref({
    _id: null,
    name: null,
    icon: null
  })
  
  // Modal
  const modal = ref({
    add: false,
    edit: false
  })
  
  watch(() => modal.value.add, (val) => !val && (stateAdd.value = {
    name: null,
    icon: null
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
      label: 'Sửa thông tin',
      icon: 'i-bx-pencil',
      click: () => {
        Object.keys(stateEdit.value).forEach(key => stateEdit.value[key] = row[key])
        modal.value.edit = true
      }
    }],[{
      label: 'Xóa thể loại',
      icon: 'i-bx-trash',
      click: () => delAction(row._id)
    }]
  ]
   
  // Fetch
  const getList = async () => {
    try {
      loading.value.load = true
      const data = await useAPI('game/manage/category/list', JSON.parse(JSON.stringify(page.value)))
  
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
      await useAPI('game/manage/category/add', JSON.parse(JSON.stringify(stateAdd.value)))
  
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
      await useAPI('game/manage/category/edit', JSON.parse(JSON.stringify(stateEdit.value)))
  
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
      await useAPI('game/manage/category/del', { _id })
  
      loading.value.del = false
      getList()
    }
    catch (e) {
      loading.value.del = false
    }
  }
  
  getList()
  </script>
  