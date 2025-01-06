<template>
  <UiContent title="Ecoin Buyer" sub="Quản lý các thương gia mua Ecoin">
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
        <template #user-data="{ row }">
          <span v-if="!row.user">...</span>
          <UBadge v-else variant="soft" color="gray" class="cursor-pointer" @click="viewUser(row.user._id)">
            {{ row.user.username }}
          </UBadge>
        </template>

        <template #[`updatedAt-data`]="{ row }">
          {{ useDayJs().displayFull(row.updatedAt) }}
        </template>

        <template #[`time.end-data`]="{ row }">
          {{ useDayJs().displayTime(row.time.end) }}
        </template>

        <template #[`limit.start-data`]="{ row }">
          {{ useMoney().toMoney(row.limit.start) }}
        </template>

        <template #[`limit.end-data`]="{ row }">
          {{ useMoney().toMoney(row.limit.end) }}
        </template>

        <template #vnd-data="{ row }">
          {{ useMoney().toMoney(row.vnd) }}
        </template>

        <template #ecoin-data="{ row }">
          {{ useMoney().toMoney(row.ecoin) }}
        </template>

        <template #active-data="{ row }">
          <UBadge :color="!!row.active ? 'green' : 'gray'" variant="soft">{{ !!row.active ? 'Đang hoạt động' : 'Không' }}</UBadge>
        </template>

        <!-- <template #actions-data="{ row }">
          <UDropdown :items="actions(row)">
            <UButton color="gray" icon="i-bx-dots-horizontal-rounded" :disabled="loading.del"/>
          </UDropdown>
        </template> -->
      </UTable>
    </UCard>

    <!-- Pagination -->
    <UiFlex justify="between" class="py-4">
      <USelectMenu v-model="selectedColumns" :options="columns" multiple placeholder="Chọn cột" />
      <UPagination v-model="page.current" :page-count="page.size" :total="page.total" :max="4" />
    </UiFlex>

    <!-- Modal User View -->
    <UModal v-model="modal.user" :ui="{width: 'sm:max-w-[900px]'}">
      <ManageUser :user="stateUser" />
    </UModal>
  </UiContent>
</template>

<script setup>
// List
const list = ref([])

// Columns
const columns = [
  {
    key: 'user',
    label: 'Tài khoản',
  },{
    key: 'limit.start',
    label: 'Giới hạn đầu',
    sortable: true
  },{
    key: 'limit.end',
    label: 'Giới hạn cuối',
    sortable: true
  },{
    key: 'vnd',
    label: 'Giá 1 Ecoin', 
    sortable: true
  },{
    key: 'updatedAt',
    label: 'Cập nhật',
    sortable: true
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
const stateUser = ref(undefined)

// Modal
const modal = ref({
  user: false
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
    const data = await useAPI('ecoin/manage/p2p/sell/list', JSON.parse(JSON.stringify(page.value)))

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
