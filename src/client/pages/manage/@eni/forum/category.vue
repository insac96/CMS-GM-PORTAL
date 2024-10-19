<template>
  <UiContent title="Forum Category" sub="Quản lý các danh mục diễn đàn">
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

        <template #name-data="{ row }">
          <UBadge :color="row.color" variant="soft">{{ row.name }}</UBadge>
        </template>

        <template #description-data="{ row }">
          <UiText class="min-w-[300px] max-w-[300px] whitespace-normal">{{ row.description }}</UiText>
        </template>

        <template #sub-data="{ row }">
          <span v-if="!row.sub || (!!row.sub && row.sub.length == 0)">...</span>
          <UiFlex v-else class="max-w-[200px] gap-1" wrap>
            <UBadge v-for="(item, i) in row.sub" :key="i" color="gray">{{ item.name }}</UBadge>
          </UiFlex>
        </template>

        <template #display-data="{ row }">
          <UBadge :color="!!row.display ? 'green' : 'gray'" variant="soft">{{ !!row.display ? 'Hiện' : 'Ẩn' }}</UBadge>
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

        <UFormGroup label="Mô tả">
          <UInput v-model="stateAdd.description" />
        </UFormGroup>

        <UFormGroup label="Biểu tượng">
          <UInput v-model="stateAdd.icon" />
        </UFormGroup>

        <UFormGroup label="Màu sắc">
          <SelectColor v-model="stateAdd.color" />
        </UFormGroup>

        <UFormGroup label="Hiển thị">
          <SelectDisplay v-model="stateAdd.display" />
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
        <UFormGroup label="Tên">
          <UInput v-model="stateEdit.name" />
        </UFormGroup>

        <UFormGroup label="Mô tả">
          <UInput v-model="stateEdit.description" />
        </UFormGroup>

        <UFormGroup label="Biểu tượng">
          <UInput v-model="stateEdit.icon" />
        </UFormGroup>

        <UFormGroup label="Màu sắc">
          <SelectColor v-model="stateEdit.color" />
        </UFormGroup>

        <UFormGroup label="Hiển thị">
          <SelectDisplay v-model="stateEdit.display" />
        </UFormGroup>

        <UiFlex justify="end" class="mt-4">
          <UButton type="submit" :loading="loading.edit">Sửa</UButton>
          <UButton color="gray" @click="modal.edit = false" :disabled="loading.edit" class="ml-1">Đóng</UButton>
        </UiFlex>
      </UForm>
    </UModal>

    <!-- Modal Sub -->
    <UModal v-model="modal.sub" preventClose :ui="{width: 'sm:max-w-[1000px]'}">
      <UiContent title="Sub Category" sub="Quản lý các danh mục con" class="p-4" no-dot>
        <template #more>
          <UButton icon="i-bx-x" class="ml-auto" size="2xs" color="gray" square @click="modal.sub = false"></UButton>
        </template>

        <ManageForumCategorySub :category="stateSub._id" />
      </UiContent>
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
    key: 'description',
    label: 'Mô tả',
  },{
    key: 'sub',
    label: 'Danh mục con'
  },{
    key: 'count',
    label: 'Bài viết',
    sortable: true
  },{
    key: 'display',
    label: 'Hiển thị',
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
  total: 0
})
watch(() => page.value.size, () => getList())
watch(() => page.value.current, () => getList())
watch(() => page.value.sort.column, () => getList())
watch(() => page.value.sort.direction, () => getList())

// State
const stateAdd = ref({
  name: null,
  description: null,
  icon: null,
  color: 'primary',
  display: true
})
const stateEdit = ref({
  _id: null,
  name: null,
  description: null,
  icon: null,
  color: null,
  display: null
})
const stateSub = ref({
  _id: null
})

// Modal
const modal = ref({
  add: false,
  edit: false,
  sub: false
})

watch(() => modal.value.add, (val) => !val && (stateAdd.value = {
  name: null,
  description: null,
  icon: null,
  color: 'primary',
  display: true
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
  },{
    label: 'Danh mục con',
    icon: 'i-bx-folder',
    click: () => {
      stateSub.value._id = row._id
      modal.value.sub = true
    }
  }],[{
    label: 'Xóa danh mục',
    icon: 'i-bx-trash',
    click: () => delAction(row._id)
  }]
]
 
// Fetch
const getList = async () => {
  try {
    loading.value.load = true
    const data = await useAPI('forum/manage/category/list', JSON.parse(JSON.stringify(page.value)))

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
    await useAPI('forum/manage/category/add', JSON.parse(JSON.stringify(stateAdd.value)))

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
    await useAPI('forum/manage/category/edit', JSON.parse(JSON.stringify(stateEdit.value)))

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
    await useAPI('forum/manage/category/del', { _id })

    loading.value.del = false
    getList()
  }
  catch (e) {
    loading.value.del = false
  }
}

getList()
</script>
