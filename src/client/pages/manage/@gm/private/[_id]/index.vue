<template>
  <UiContent title="Người Chơi" sub="Danh sách người chơi">
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
          <UBadge v-else variant="soft" color="gray" class="cursor-pointer">
            {{ row.user.username }}
          </UBadge>
        </template>

        <template #[`spend.total.coin-data`]="{ row }">
          {{ toMoney(row.spend.total.coin || 0) }}
        </template>

        <template #block-data="{ row }">
          <UBadge :color="row.block == 1 ? 'red' : 'gray'" variant="soft">{{ row.block == 1 ? 'Có' : 'Không' }}</UBadge>
        </template>

        <template #createdAt-data="{ row }">
          {{ useDayJs().displayFull(row.createdAt) }}
        </template>

        <template #actions-data="{ row }">
          <UDropdown :items="actions(row)">
            <UButton color="gray" icon="i-bx-dots-horizontal-rounded" />
          </UDropdown>
        </template>
      </UTable>
    </UCard>

    <!-- Pagination -->
    <UiFlex justify="between" class="mt-4">
      <USelectMenu v-model="selectedColumns" :options="columns" multiple placeholder="Chọn cột" />
      <UPagination v-model="page.current" :page-count="page.size" :total="page.total" :max="4" />
    </UiFlex>

		<!-- Modal Edit Auth-->
    <UModal v-model="modal.editAuth" preventClose>
      <UForm :state="stateEditAuth" @submit="editAuthAction" class="p-4">
        <UFormGroup label="Khóa">
          <SelectAuthBlock v-model="stateEditAuth.block" />
        </UFormGroup>

        <UiFlex justify="end" class="mt-4">
          <UButton type="submit" :loading="loading.edit">Sửa</UButton>
          <UButton color="gray" @click="modal.editAuth = false" :disabled="loading.edit" class="ml-1">Đóng</UButton>
        </UiFlex>
      </UForm>
    </UModal>

    <!-- Modal Edit Spend-->
    <UModal v-model="modal.editSpend" preventClose>
      <UForm :state="stateEditSpend" @submit="editSpendAction" class="p-4" v-if="stateEditSpend.spend">
        <UFormGroup label="Ngày">
          <UInput v-model="stateEditSpend.spend.day.coin" type="number" />
        </UFormGroup>

				<UFormGroup label="Tuần">
          <UInput v-model="stateEditSpend.spend.week.coin" type="number" />
        </UFormGroup>

        <UFormGroup label="Tháng">
          <UInput v-model="stateEditSpend.spend.month.coin" type="number" />
        </UFormGroup>

        <UFormGroup label="Tổng">
          <UInput v-model="stateEditSpend.spend.total.coin" type="number" />
        </UFormGroup>

        <UiFlex justify="end" class="mt-4">
          <UButton type="submit" :loading="loading.edit">Sửa</UButton>
          <UButton color="gray" @click="modal.editSpend = false" :disabled="loading.edit" class="ml-1">Đóng</UButton>
        </UiFlex>
      </UForm>
    </UModal>

    <!-- Modal Edit Login-->
    <UModal v-model="modal.editLogin" preventClose>
      <UForm :state="stateEditLogin" @submit="editLoginAction" class="p-4" v-if="stateEditLogin.login">
        <UFormGroup label="Tuần">
          <UInput v-model="stateEditLogin.login.week" type="number" />
        </UFormGroup>
				
				<UFormGroup label="Tháng">
          <UInput v-model="stateEditLogin.login.month" type="number" />
        </UFormGroup>

        <UFormGroup label="Tổng">
          <UInput v-model="stateEditLogin.login.total" type="number" />
        </UFormGroup>

        <UiFlex justify="end" class="mt-4">
          <UButton type="submit" :loading="loading.edit">Sửa</UButton>
          <UButton color="gray" @click="modal.editLogin = false" :disabled="loading.edit" class="ml-1">Đóng</UButton>
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
    key: 'user',
    label: 'Tài khoản',
  },{
    key: 'block',
    label: 'Khóa',
    sortable: true
  },{
    key: 'spend.total.coin',
    label: 'Tổng tiêu',
		sortable: true
  },{
    key: 'createdAt',
    label: 'Ngày bắt đầu',
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
const stateEditAuth = ref({
  _id: null,
	game: game._id,
  block: null
})

const stateEditSpend = ref({
  _id: null,
	game: game._id,
  spend: null
})

const stateEditLogin = ref({
  _id: null,
	game: game._id,
  login: null
})

// Modal
const modal = ref({
  user: false,
  editAuth: false,
  editSpend: false,
  editLogin: false
})

// Loading
const loading = ref({
  load: true,
	edit: false
})

const actions = (row) => [
  [{
    label: 'Sửa thông tin',
    icon: 'i-bx-pencil',
    click: () => {
      Object.keys(stateEditAuth.value).forEach(key => stateEditAuth.value[key] = row[key])
      stateEditAuth.value._id = row._id
      modal.value.editAuth = true
    }
  }],[{
    label: 'Sửa tiêu phí',
    icon: 'i-bx-wallet-alt',
    click: () => {
      stateEditSpend.value.spend = JSON.parse(JSON.stringify(row.spend))
      stateEditSpend.value._id = row._id
      modal.value.editSpend = true
    }
  },{
    label: 'Sửa đăng nhập',
    icon: 'i-bx-calendar',
    click: () => {
      stateEditLogin.value.login = JSON.parse(JSON.stringify(row.login))
      stateEditLogin.value._id = row._id
      modal.value.editLogin = true
    }
  }]
]
 
// Fetch
const getList = async () => {
  try {
    loading.value.load = true
    const data = await useAPI('game/private/manage/user/list', JSON.parse(JSON.stringify(page.value)))

    loading.value.load = false
    list.value = data.list
    page.value.total = data.total
  }
  catch (e) {
    loading.value.load = false
  } 
}

const editAuthAction = async () => {
  try {
    loading.value.edit = true
    await useAPI('game/private/manage/user/edit/auth', JSON.parse(JSON.stringify(stateEditAuth.value)))

    loading.value.edit = false
    modal.value.editAuth = false
    getList()
  }
  catch (e) {
    loading.value.edit = false
  }
}

const editSpendAction = async () => {
  try {
    loading.value.edit = true
    await useAPI('game/private/manage/user/edit/spend', JSON.parse(JSON.stringify(stateEditSpend.value)))

    loading.value.edit = false
    modal.value.editSpend = false
    getList()
  }
  catch (e) {
    loading.value.edit = false
  }
}

const editLoginAction = async () => {
  try {
    loading.value.edit = true
    await useAPI('game/private/manage/user/edit/login', JSON.parse(JSON.stringify(stateEditLogin.value)))

    loading.value.edit = false
    modal.value.editLogin = false
    getList()
  }
  catch (e) {
    loading.value.edit = false
  }
}

onMounted(() => setTimeout(getList, 1))
</script>
