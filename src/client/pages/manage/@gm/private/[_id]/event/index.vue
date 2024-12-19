<template>
	<UiContent title="Sự Kiện" sub="Quản lý mốc thưởng sự kiện" no-dot>
		<template #more>
			<UButton 
				icon="i-bx-time" 
				size="xs" 
				class="ml-auto"
				:to="`/manage/@gm/private/${game._id}/event/history`"
			>
				Lịch sử
			</UButton>
		</template>

		<UiFlex class="mb-4 gap-1">
      <USelectMenu v-model="page.size" :options="[5,10,20,50,100]"/>

      <USelectMenu 
        v-model="page.type" 
        value-attribute="key"
        option-attribute="label"
        :options="events"
				placeholder="Chọn sự kiện"
        class="mr-auto sm:min-w-[200px] sm:grow-0 grow"
      ></USelectMenu>  

      <UButton color="gray" @click="modal.add = true">Thêm mốc</UButton>
		</UiFlex>

		<!-- Table -->
		<UCard :ui="{ body: { padding: 'p-0 sm:p-0' } }">
			<LoadingTable v-if="loading.load" />

			<UTable 
				v-model:sort="page.sort"
				:columns="selectedColumns"
				:rows="list"
			>
				<template #need-data="{ row }">
					<UiText weight="semibold">{{ useMoney().toMoney(row.need) }}</UiText>
				</template>

				<template #gift-data="{ row }">
					<DataGamePrivateItemList :items="row.gift" class="max-w-[300px]" :size="45" :game="game.code" />
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

		<!-- Modal Add -->
    <UModal v-model="modal.add" preventClose>
      <UForm :state="stateAdd" @submit="addAction" class="p-4">
        <UFormGroup label="Yêu cầu">
          <UInput v-model="stateAdd.need" type="number" />
        </UFormGroup>

				<UFormGroup label="Vật phẩm">
          <SelectGamePrivateItemList v-model="stateAdd.gift" :game="game.code" />
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
        <UFormGroup label="Yêu cầu">
          <UInput v-model="stateEdit.need" type="number" />
        </UFormGroup>

				<UFormGroup label="Vật phẩm">
          <SelectGamePrivateItemList v-model="stateEdit.gift" :game="game.code" />
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

    <!-- Pagination -->
    <UiFlex justify="between" class="py-4">
      <USelectMenu v-model="selectedColumns" :options="columns" multiple placeholder="Chọn cột" />
      <UPagination v-model="page.current" :page-count="page.size" :total="page.total" :max="4" />
    </UiFlex>
    
	</UiContent>
</template>

<script setup>
const game = useAttrs().game
const list = ref([])

const events = [
	{ label: 'Điểm Danh Tuần', key: 'login.week' },
	{ label: 'Điểm Danh Tháng', key: 'login.month' },
	{ label: 'Điểm Danh Tổng', key: 'login.total' },
	{ label: 'Tiêu Phí Ngày', key: 'spend.day.coin' },
	{ label: 'Tiêu Phí Tuần', key: 'spend.week.coin' },
	{ label: 'Tiêu Phí Tháng', key: 'spend.month.coin' },
	{ label: 'Tiêu Phí Tổng', key: 'spend.total.coin' },
]

const columns = [
  {
    key: 'need',
    label: 'Yêu cầu',
    sortable: true
  },{
    key: 'gift',
    label: 'Phần thưởng',
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

const page = ref({
  size: 10,
  current: 1,
  sort: {
    column: 'need',
    direction: 'asc'
  },
  total: 0,
	type: 'login.week',
	game: game._id
})
watch(() => page.value.size, () => getList())
watch(() => page.value.current, () => getList())
watch(() => page.value.sort.column, () => getList())
watch(() => page.value.sort.direction, () => getList())
watch(() => page.value.type, (val) => getList() && (stateAdd.value.type = val))

const stateAdd = ref({
  type: page.value.type,
  need: null,
	gift: [],
  display: true,
	game: game._id
})
const stateEdit = ref({
  _id: null,
  need: null,
	gift: null,
  display: null,
	type: null,
	game: game._id
})

const modal = ref({
  add: false,
  edit: false
})

const loading = ref({
  load: true,
  add: false,
  edit: false,
  del: false
})

watch(() => modal.value.add, (val) => !val && (stateAdd.value = {
  type: page.value.type,
  need: null,
	gift: [],
  display: true,
	game: game._id
}))

// Actions
const actions = (row) => [
  [{
    label: 'Sửa mốc',
    icon: 'i-bx-pencil',
    click: () => {
      Object.keys(stateEdit.value).forEach(key => stateEdit.value[key] = row[key])
      stateEdit.value.game = game._id
      modal.value.edit = true
    }
  }],[{
    label: 'Xóa mốc',
    icon: 'i-bx-trash',
    click: () => delAction(row._id)
  }]
]

const getList = async () => {
  try {
    loading.value.load = true
    const data = await useAPI('game/private/manage/event/list', JSON.parse(JSON.stringify(page.value)))

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
    await useAPI('game/private/manage/event/add', JSON.parse(JSON.stringify(stateAdd.value)))

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
    await useAPI('game/private/manage/event/edit', JSON.parse(JSON.stringify(stateEdit.value)))

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
    await useAPI('game/private/manage/event/del', {
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

onMounted(() => setTimeout(getList, 1))
</script>