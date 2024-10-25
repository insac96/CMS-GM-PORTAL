<template>
  <UiContent title="Cửa Hàng Vật Phẩm" sub="Quản lý vật phẩm bày bán" no-dot>
		<template #more>
			<UButton 
				icon="i-bx-time" 
				size="xs" 
				class="ml-auto"
				:to="`/manage/@gm/private/${game._id}/shop/item/history`"
			>
				Lịch sử
			</UButton>
		</template>

    <UiFlex class="mb-4 gap-1">
      <USelectMenu v-model="page.size" :options="[5,10,20,50,100]" class="mr-1"/>

      <UForm :state="page" @submit="page.current = 1, getList()" class="mr-1">
        <UInput v-model="page.search" placeholder="Tìm kiếm..." icon="i-bx-search" size="sm" />
      </UForm>

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
        <template #[`item.item_image-data`]="{ row }">
          <DataGamePrivateItemImage :src="row.item.item_image" :game="game.code" />
        </template>

        <template #amount-data="{ row }">
          {{ toMoney(row.amount) }}
        </template>

        <template #price-data="{ row }">
          <UiText weight="semibold">{{ toMoney(row.price) }}</UiText>
        </template>

        <template #limit-data="{ row }">
          {{ row.limit == 0 ? 'Không giới hạn' : `${row.limit} lần` }}
        </template>

        <template #pin-data="{ row }">
          <UBadge :color="!!row.pin ? 'green' : 'gray'" variant="soft">{{ !!row.pin ? 'Có' : 'Không' }}</UBadge>
        </template>

        <template #display-data="{ row }">
          <UBadge :color="!!row.display ? 'green' : 'gray'" variant="soft">{{ !!row.display ? 'Hiện' : 'Ẩn' }}</UBadge>
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
        <UFormGroup label="Vật phẩm">
          <SelectGamePrivateItem v-model="stateAdd.item" :game="game.code" />
        </UFormGroup>

        <UFormGroup label="Số lượng vật phẩm">
          <UInput v-model="stateAdd.amount" type="number" />
        </UFormGroup>

        <UFormGroup label="Giá tiền">
          <UInput v-model="stateAdd.price" type="number" />
        </UFormGroup>

        <UFormGroup label="Giới hạn mua">
          <UInput v-model="stateAdd.limit" type="number" />
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
        <UFormGroup label="Số lượng vật phẩm">
          <UInput v-model="stateEdit.amount" type="number" />
        </UFormGroup>

        <UFormGroup label="Giá tiền">
          <UInput v-model="stateEdit.price" type="number" />
        </UFormGroup>
        
        <UFormGroup label="Giới hạn mua">
          <UInput v-model="stateEdit.limit" type="number" />
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
const { toMoney } = useMoney()
// List
const list = ref([])

// Columns
const columns = [
  {
    key: 'item.item_image',
    label: 'Vật phẩm',
  },{
    key: 'item.item_name',
    label: 'Tên',
    sortable: true
  },{
    key: 'amount',
    label: 'Số lượng',
    sortable: true
  },{
    key: 'price',
    label: 'Giá tiền',
    sortable: true
  },{
    key: 'limit',
    label: 'Giới hạn mua',
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
  item: null,
  amount: 1,
  price: null,
  limit: 0,
  pin: false,
  display: true,
	game: game._id
})
const stateEdit = ref({
  _id: null,
  amount: null,
  price: null,
  limit: null,
  pin: null,
  display: null,
	game: game._id
})

// Modal
const modal = ref({
  add: false,
  edit: false
})

watch(() => modal.value.add, (val) => !val && (stateAdd.value = {
  item: null,
  amount: 1,
  price: null,
  limit: 0,
  pin: false,
  display: true,
	game: game._id
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
    label: 'Sửa vật phẩm',
    icon: 'i-bx-pencil',
    click: () => {
      Object.keys(stateEdit.value).forEach(key => stateEdit.value[key] = row[key])
      modal.value.edit = true
    }
  }],[{
    label: 'Xóa vật phẩm',
    icon: 'i-bx-trash',
    click: () => delAction(row._id)
  }]
]
 
// Fetch
const addAction = async () => {
  try {
    loading.value.add = true
    await useAPI('game/private/manage/shop/item/add', JSON.parse(JSON.stringify(stateAdd.value)))

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
    await useAPI('game/private/manage/shop/item/edit', JSON.parse(JSON.stringify(stateEdit.value)))

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
    await useAPI('game/private/manage/shop/item/del', { 
			_id: _id,
			game: game._id
		})

    loading.value.del = false
    getList()
  }
  catch (e) {
    loading.value.del = false
  }
}

const getList = async () => {
  try {
    loading.value.load = true
    const data = await useAPI('game/private/manage/shop/item/list', JSON.parse(JSON.stringify(page.value)))

    loading.value.load = false
    list.value = data.list
    page.value.total = data.total
  }
  catch (e) {
    loading.value.load = false
  } 
}

onMounted(() => setTimeout(getList, 1))
</script>
