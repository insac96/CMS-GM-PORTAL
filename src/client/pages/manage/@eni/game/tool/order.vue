<template>
  <UiContent title="Order" sub="Quản lý giao dịch mua Tool">
    <UiFlex class="mb-4 gap-1">
      <USelectMenu v-model="page.size" :options="[5,10,20,50,100]" />
      <UForm :state="page" @submit="page.current = 1, getList()">
        <UiFlex class="gap-1">
          <UInput v-model="page.search.key" placeholder="Tìm kiếm..." icon="i-bx-search" size="sm" />
          <USelectMenu v-model="page.search.by" :options="['GAME', 'USER']" />
        </UiFlex>
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

        <template #game-data="{ row }">
          {{ row.game ? row.game.name : '...' }}
        </template>

        <template #coin-data="{ row }">
          <UiText weight="semibold">{{ useMoney().toMoney(row.money) }}</UiText>
        </template>

        <template #createdAt-data="{ row }">
          {{ useDayJs().displayFull(row.createdAt) }}
        </template>

        <template #actions-data="{ row }">
          <UDropdown :items="actions(row)">
            <UButton color="gray" icon="i-bx-dots-horizontal-rounded"/>
          </UDropdown>
        </template>
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
      label: 'Người mua',
    },{
      key: 'game',
      label: 'Trò chơi'
    },{
      key: 'recharge',
      label: 'Tool nạp'
    },{
      key: 'mail',
      label: 'Tool thư'
    },{
      key: 'coin',
      label: 'Giá Xu'
    },{
      key: 'createdAt',
      label: 'Ngày tạo',
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
    search: {
      key: null,
      by: 'USER'
    },
    total: 0
  })
  watch(() => page.value.size, () => getList())
  watch(() => page.value.current, () => getList())
  watch(() => page.value.sort.column, () => getList())
  watch(() => page.value.sort.direction, () => getList())
  watch(() => page.value.search.key, (val) => !val && getList())
  
  // State
  const stateUser = ref(undefined)

  // Modal
  const modal = ref({
    user: false
  })

  // Loading
  const loading = ref({
    load: true,
  })
  
  const viewUser = (_id) => {
    stateUser.value = _id
    modal.value.user = true
  }
  
  // Fetch
  const getList = async () => {
    try {
      loading.value.load = true
      const data = await useAPI('order/manage/list', JSON.parse(JSON.stringify(page.value)))
  
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
  