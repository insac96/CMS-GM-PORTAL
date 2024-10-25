<template>
  <UiContent title="Cửa Hàng Gói Nạp" sub="Danh sách gói nạp trong trò chơi" no-dot>
		<template #more>
			<UButton 
				icon="i-bx-time" 
				size="xs" 
				class="ml-auto"
				:to="`/manage/@gm/private/${game._id}/recharge/history`"
			>
				Lịch sử
			</UButton>
		</template>

    <UiFlex class="mb-4 gap-1">
      <USelectMenu v-model="page.size" :options="[5,10,20,50,100]"/>
      <UForm :state="page" @submit="page.current = 1, getList()" class="mr-auto">
        <UInput v-model="page.search" placeholder="Tìm kiếm..." icon="i-bx-search" size="sm" />
      </UForm>

      <UButton color="gray" @click="modal.add = true" class="ml-1">Thêm mới</UButton>
    </UiFlex>
    
    <!-- Table -->
    <UCard :ui="{ body: { padding: 'p-0 sm:p-0' } }">
      <LoadingTable v-if="loading.load" />

      <UTable 
        v-model:sort="page.sort"
        :columns="selectedColumns" 
        :rows="list"
      >
        <template #save_pay-data="{ row }">
          {{ useMoney().toMoney(row.save_pay) }}
        </template>

				<template #price-data="{ row }">
          {{ useMoney().toMoney(row.price) }}
        </template>

				<template #pin-data="{ row }">
          <UBadge :color="!!row.pin ? 'green' : 'gray'" variant="soft">{{ !!row.pin  ? 'Có' : 'Không' }}</UBadge>
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
      <UPagination v-model="page.current" :page-count="page.size" :total="page.total" :max="5" />
    </UiFlex>

    <!-- Modal Add -->
    <UModal v-model="modal.add" preventClose>
      <UForm :state="stateAdd" @submit="addAction" class="p-4">
        <UFormGroup label="Mã Gói">
          <UInput v-model="stateAdd.recharge_id" />
        </UFormGroup>

        <UFormGroup label="Tên Gói">
          <UInput v-model="stateAdd.recharge_name" />
        </UFormGroup>

        <UFormGroup label="Giá Ingame">
          <UInput v-model="stateAdd.save_pay" type="number" />
        </UFormGroup>

				<UFormGroup label="Giá Bán">
          <UInput v-model="stateAdd.price" type="number" />
        </UFormGroup>

				<UFormGroup label="Hiển thị">
          <SelectDisplay v-model="stateAdd.display" />
        </UFormGroup>

        <UiFlex class="mt-4">
					<SelectPin v-model="stateAdd.pin" class="mr-auto"/>

          <UButton type="submit" :loading="loading.add">Thêm</UButton>
          <UButton color="gray" @click="modal.add = false" :disabled="loading.add" class="ml-1">Đóng</UButton>
        </UiFlex>
      </UForm>
    </UModal>

    <!-- Modal Edit -->
    <UModal v-model="modal.edit" preventClose>
      <UForm :state="stateEdit" @submit="editAction" class="p-4">
        <UFormGroup label="Mã Gói">
          <UInput v-model="stateEdit.recharge_id" />
        </UFormGroup>

        <UFormGroup label="Tên Gói">
          <UInput v-model="stateEdit.recharge_name" />
        </UFormGroup>

        <UFormGroup label="Giá Ingame">
          <UInput v-model="stateEdit.save_pay" type="number" />
        </UFormGroup>

				<UFormGroup label="Giá Bán">
          <UInput v-model="stateEdit.price" type="number" />
        </UFormGroup>

				<UFormGroup label="Hiển thị">
          <SelectDisplay v-model="stateEdit.display" />
        </UFormGroup>

        <UiFlex class="mt-4">
					<SelectPin v-model="stateEdit.pin" class="mr-auto"/>

          <UButton type="submit" :loading="loading.edit">Sửa</UButton>
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
    key: 'recharge_id',
    label: 'Mã gói',
    sortable: true
  },{
    key: 'recharge_name',
    label: 'Tên gói',
    sortable: true
  },{
    key: 'save_pay',
    label: 'Giá Ingame',
    sortable: true
  },{
    key: 'price',
    label: 'Giá bán',
    sortable: true
  },{
    key: 'pin',
    label: 'Ghim',
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
    column: 'recharge_id',
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
const stateAdd = ref({
  recharge_id: null,
  recharge_name: null,
  save_pay: null,
	price: null,
	pin: false,
  display: true,
  game: game._id
})
const stateEdit = ref({
  _id: null,
  recharge_id: null,
  recharge_name: null,
  save_pay: null,
	price: null,
	pin: null,
  display: null,
  game: game._id
})
const stateDel = ref({
  _id: null,
  game: game._id
})

// Modal
const modal = ref({
  add: false,
  edit: false
})

watch(() => modal.value.add, (val) => !val && (stateAdd.value = {
  recharge_id: null,
  recharge_name: null,
  save_pay: null,
	price: null,
	pin: false,
  display: true,
  game: game._id
}))

// Loading
const loading = ref({
  load: true,
  add: false,
  edit: false,
  del: false,
})

// Actions
const actions = (row) => [
  [{
    label: 'Sửa gói nạp',
    icon: 'i-bx-pencil',
    click: () => {
      Object.keys(stateEdit.value).forEach(key => stateEdit.value[key] = row[key])
      stateEdit.value.game = game._id
      modal.value.edit = true
    }
  }],[{
    label: 'Xóa gói nạp',
    icon: 'i-bx-trash',
    click: async () => {
      Object.keys(stateDel.value).forEach(key => stateDel.value[key] = row[key])
      stateDel.value.game = game._id
      await delAction()
    }
  }]
]
 
// Fetch
const getList = async () => {
  try {
    loading.value.load = true
    const data = await useAPI('game/private/manage/recharge/list', JSON.parse(JSON.stringify(page.value)))

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
    await useAPI('game/private/manage/recharge/add', JSON.parse(JSON.stringify(stateAdd.value)))

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
    await useAPI('game/private/manage/recharge/edit', JSON.parse(JSON.stringify(stateEdit.value)))

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
    await useAPI('game/private/manage/recharge/del', JSON.parse(JSON.stringify(stateDel.value)))

    loading.value.del = false
    getList()
  }
  catch (e) {
    loading.value.del = false
  }
}

onMounted(() => setTimeout(getList, 1))
</script>
