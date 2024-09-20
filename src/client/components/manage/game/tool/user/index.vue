<template>
  <div>
    <UiFlex class="mb-4 gap-1">
      <USelectMenu v-model="page.size" :options="[5,10,20,50,100]" />
      <UForm :state="page" @submit="page.current = 1, getList()">
        <UInput v-model="page.search" placeholder="Tìm kiếm..." icon="i-bx-search" size="sm" />
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
        <template #user-data="{ row }">
          <span v-if="!row.user">...</span>
          <UBadge v-else variant="soft" color="gray" class="cursor-pointer" @click="viewUser(row.user._id)">
            {{ row.user.username }}
          </UBadge>
        </template>

        <template #recharge-data="{ row }">
          <UiIcon name="i-bxs-check-circle" color="green" size="5" v-if="!!row.recharge"></UiIcon>
          <UiIcon name="i-bxs-x-circle" color="gray" size="5" v-else></UiIcon>
        </template>

        <template #mail-data="{ row }">
          <UiIcon name="i-bxs-check-circle" color="green" size="5" v-if="!!row.mail"></UiIcon>
          <UiIcon name="i-bxs-x-circle" color="gray" size="5" v-else></UiIcon>
        </template>

        <template #createdAt-data="{ row }">
          {{ useDayJs().displayFull(row.createdAt) }}
        </template>
      </UTable>
    </UCard>

    <!-- Pagination -->
    <UiFlex justify="between" class="mt-4">
      <USelectMenu v-model="selectedColumns" :options="columns" multiple placeholder="Chọn cột" />
      <UPagination v-model="page.current" :page-count="page.size" :total="page.total" :max="4" />
    </UiFlex>

    <!-- Modal User View -->
    <UModal v-model="modal.user" :ui="{width: 'sm:max-w-[800px]'}">
      <ManageUser :user="stateUser" />
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
    key: 'user',
    label: 'Tài khoản',
  },{
    key: 'recharge',
    label: 'Tool nạp',
  },{
    key: 'mail',
    label: 'Tool thư',
  },{
    key: 'createdAt',
    label: 'Ngày bắt đầu',
    sortable: true
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
const stateUser = ref(undefined)

// Modal
const modal = ref({
  user: false,
})

// Loading
const loading = ref({
  load: true
})

const viewUser = (_id) => {
  stateUser.value = _id
  modal.value.user = true
}
 
// Fetch
const getList = async () => {
  try {
    loading.value.load = true
    const data = await useAPI('game/tool/manage/user/list', JSON.parse(JSON.stringify(page.value)))

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
