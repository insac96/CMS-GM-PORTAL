<template>
  <UiContent title="IP Log" sub="Danh sách IP người dùng">
    <UiFlex class="mb-4 gap-1">
      <USelectMenu v-model="page.size" :options="[5,10,20,50,100]" />

      <UForm :state="page" @submit="page.current = 1, getList()">
        <UInput v-model="page.search.key" placeholder="Tìm kiếm..." icon="i-bx-search" size="sm" />
      </UForm>
    </UiFlex>
    
    <!-- Table -->
    <UCard :ui="{ body: { padding: 'p-0 sm:p-0' } }">
      <LoadingTable v-if="loading.load" />

      <UTable 
        v-model:sort="page.sort"
        :columns="selectedColumns"
        :rows="list"
      >
        <template #ip-data="{ row }">
          <UiText weight="semibold">{{ row.ip }}</UiText>
        </template>

        <template #users-data="{ row }">
          <UButton 
            v-for="user in row.users" :key="user._id"
            size="2xs" color="gray" class="m-1"
            @click="viewUser(user._id)"
          >{{ user.username }}</UButton>
        </template>
        
        <template #block-data="{ row }">
          <UBadge :color="row.block == 1 ? 'red' : 'gray'">{{ row.block == 1 ? 'Có' : 'Không' }}</UBadge>
        </template>

        <template #action-data="{ row }">
          <UButton v-if="!row.block" color="gray" size="xs" icon="i-bxs-lock-alt" @click="startBlock(row.ip, 'block')" :loading="loading.block" />
          <UButton v-if="!!row.block" color="gray" size="xs" icon="i-bxs-lock-open-alt" @click="startBlock(row.ip, 'unblock')" :loading="loading.block" />
        </template>
      </UTable>
    </UCard>

    <!-- Pagination -->
    <UiFlex justify="between" class="py-4">
      <USelectMenu v-model="selectedColumns" :options="columns" multiple placeholder="Chọn cột" />
      <UPagination v-model="page.current" :page-count="page.size" :total="page.total" :max="4" />
    </UiFlex>

    <!--Modal User Info-->
    <UModal v-model="modal.user" :ui="{width: 'sm:max-w-[900px]'}">
      <ManageUser :user="stateUser" />
    </UModal>

    <!--Modal User Info-->
    <UModal v-model="modal.block" preventClose>
      <UiContent :title="stateBlock.action == 'block' ? 'Khóa IP' : 'Mở Khóa IP'" class="p-4" no-dot>
        <UAlert title="Chú Ý" icon="i-bxs-info-circle" :color="stateBlock.action == 'block' ? 'red' : 'green'" variant="soft">
          <template #description>
            Bạn chắc chắn muốn {{ stateBlock.action == 'block' ? 'chặn' : 'mở khóa' }} IP <b>{{ stateBlock.ip }}</b> truy cập !
          </template>
        </UAlert>

        <UiFlex class="mt-4" justify="end">
          <UButton @click="block" :loading="loading.block" :color="stateBlock.action == 'block' ? 'red' : 'green'">Xác Nhận</UButton>
          <UButton color="gray" @click="modal.block = false" :disabled="loading.block" class="ml-1">Đóng</UButton>
        </UiFlex>
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
    key: 'ip',
    label: 'Địa chỉ',
  },{
    key: 'count',
    label: 'Số tài khoản',
    sortable: true
  },{
    key: 'users',
    label: 'Tài khoản'
  },{
    key: 'block',
    label: 'Trạng thái khóa',
    sortable: true
  },{
    key: 'action',
    label: 'Chức năng',
  }
]
const selectedColumns = ref([...columns])

// Page
const page = ref({
  size: 10,
  current: 1,
  sort: {
    column: 'users',
    direction: 'desc'
  },
  search: {
    key: null,
    by: 'IP'
  },
  total: 0,
})
watch(() => page.value.size, () => getList())
watch(() => page.value.current, () => getList())
watch(() => page.value.sort.column, () => getList())
watch(() => page.value.sort.direction, () => getList())
watch(() => page.value.search.key, (val) => !val && getList())

// Modal
const modal = ref({
  user: false,
  block: false
})

// Loading
const loading = ref({
  load: true,
  block: false
})

// State
const stateUser = ref(undefined)

const stateBlock = ref({
  ip: null,
  action: null
})

// View User
const viewUser = (_id) => {
  modal.value.user = true
  stateUser.value = _id
}

// View Block
const startBlock = (ip, action) => {
  stateBlock.value.ip = ip
  stateBlock.value.action = action
  modal.value.block = true
}

// Fetch
const block = async () => {
  try {
    loading.value.block = true
    await useAPI('ip/user/block', JSON.parse(JSON.stringify(stateBlock.value)))

    loading.value.block = false
    modal.value.block = false
    getList()
  }
  catch (e) {
    loading.value.block = false
  }
}

const getList = async () => {
  try {
    loading.value.load = true
    const data = await useAPI('ip/user/list', JSON.parse(JSON.stringify(page.value)))

    loading.value.load = false
    list.value = data.list
    page.value.total = data.total
  }
  catch (e) {
    loading.value.load = false
  } 
}

getList()
</script>
