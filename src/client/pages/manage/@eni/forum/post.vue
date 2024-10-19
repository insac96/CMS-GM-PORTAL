<template>
  <UiContent title="Forum Category" sub="Quản lý các danh mục diễn đàn">
    <UiFlex class="mb-4">
      <USelectMenu v-model="page.size" :options="[5,10,20,50,100]" class="mr-auto"/>
    </UiFlex>
    
    <!-- Table -->
    <UCard :ui="{ body: { padding: 'p-0 sm:p-0' } }">
      <LoadingTable v-if="loading.load" />

      <UTable 
        v-model:sort="page.sort"
        :columns="selectedColumns" 
        :rows="list"
      >
        <template #title-data="{ row }">
          <UiText class="min-w-[200px] max-w-[200px] whitespace-normal">{{ row.title }}</UiText>
        </template>

        <template #category-data="{ row }">
          <UBadge color="gray" variant="soft">{{ row.category.name }}</UBadge>
          <UBadge color="gray" variant="soft" class="ml-1" v-if="!!row.sub">{{ row.sub.name }}</UBadge>
        </template>

        <template #pin-data="{ row }">
          <UBadge :color="!!row.pin ? 'green' : 'gray'" variant="soft">{{ !!row.pin ? 'Có' : 'Không' }}</UBadge>
        </template>

        <template #close-data="{ row }">
          <UBadge :color="!!row.close ? 'rose' : 'gray'" variant="soft">{{ !!row.close ? 'Có' : 'Không' }}</UBadge>
        </template>

        <template #block-data="{ row }">
          <UBadge :color="!!row.block ? 'rose' : 'gray'" variant="soft">{{ !!row.block ? 'Có' : 'Không' }}</UBadge>
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
  </UiContent>
</template>

<script setup>
// List
const list = ref([])

// Columns
const columns = [
  {
    key: 'title',
    label: 'Tiêu đề',
  },{
    key: 'category',
    label: 'Danh mục',
  },{
    key: 'statistic.view',
    label: 'Xem',
    sortable: true
  },{
    key: 'statistic.like',
    label: 'Thích',
    sortable: true
  },{
    key: 'statistic.comment',
    label: 'Bình luận',
    sortable: true
  },{
    key: 'pin',
    label: 'Ghim',
    sortable: true
  },{
    key: 'close',
    label: 'Đóng',
    sortable: true
  },{
    key: 'block',
    label: 'Khóa',
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
const stateEdit = ref({
  _id: null,
  name: null,
  description: null,
  icon: null,
  color: null,
  display: null
})

// Modal
const modal = ref({
  edit: false,
})

// Loading
const loading = ref({
  load: true,
  edit: false,
  del: false
})

// Actions
const actions = (row) => [
  // [{
  //   label: 'Sửa thông tin',
  //   icon: 'i-bx-pencil',
  //   click: () => {
  //     Object.keys(stateEdit.value).forEach(key => stateEdit.value[key] = row[key])
  //     modal.value.edit = true
  //   }
  // }],
  [{
    label: 'Xóa bài viết',
    icon: 'i-bx-trash',
    click: () => delAction(row._id)
  }]
]
 
// Fetch
const getList = async () => {
  try {
    loading.value.load = true
    const data = await useAPI('forum/manage/post/list', JSON.parse(JSON.stringify(page.value)))

    loading.value.load = false
    list.value = data.list
    page.value.total = data.total
  }
  catch (e) {
    loading.value.load = false
  } 
}

const editAction = async () => {
  try {
    loading.value.edit = true
    await useAPI('forum/manage/post/edit', JSON.parse(JSON.stringify(stateEdit.value)))

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
    await useAPI('forum/manage/post/del', { _id })

    loading.value.del = false
    getList()
  }
  catch (e) {
    loading.value.del = false
  }
}

getList()
</script>
