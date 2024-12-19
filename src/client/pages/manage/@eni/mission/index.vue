<template>
  <UiContent title="Mission" sub="Quản lý các nhiệm vụ">
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
        <template #gift-data="{ row }">
          <UiFlex wrap class="gap-1">
            <div v-for="(value, key) in row.gift" :key="key">
              <UBadge color="gray">
                <strong class="mr-1">{{ toMoney(value) }}</strong>
                {{ currencyFormat[key] }} 
              </UBadge>
            </div>
          </UiFlex>
        </template>

        <template #daily-data="{ row }">
          <UBadge :color="!!row.daily ? 'green' : 'gray'" variant="soft">{{ !!row.daily ? 'Có' : 'Không' }}</UBadge>
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
        <UFormGroup label="Loại">
          <SelectMissionType v-model="stateAdd.type" />
        </UFormGroup>

        <UFormGroup label="Tên">
          <UInput v-model="stateAdd.title" />
        </UFormGroup>

        <UFormGroup label="Mô tả">
          <UInput v-model="stateAdd.description" />
        </UFormGroup>

        <UFormGroup label="Yêu cầu" v-if="!!stateAdd.type">
          <UInput placeholder="Không cần điều kiện" disabled v-if="!!['pay.first', 'vip.upgrade'].includes(stateAdd.type)" />
          <SelectGamePrivate v-model="stateAdd.need" v-else-if="!!['game.private.play', 'game.private.comment', 'game.private.shopping'].includes(stateAdd.type)"/>
          <SelectGameTool v-model="stateAdd.need" v-else-if="!!['game.tool.buy', 'game.tool.comment'].includes(stateAdd.type)"/>
          <SelectGameChina v-model="stateAdd.need" v-else-if="!!['game.china.play', 'game.china.comment', 'game.china.pay.success'].includes(stateAdd.type)"/>
          <UInput v-model="stateAdd.need" v-else />
        </UFormGroup>

        <UFormGroup label="Điều kiện thêm" v-if="stateAdd.type == 'game.private.play'">
          <UiFlex class="gap-1">
            <UInput v-model="stateAdd.more.game.private.level" type="number" class="grow">
              <template #trailing>Level</template>
            </UInput>
            <UInput v-model="stateAdd.more.game.private.power" type="number" class="grow">
              <template #trailing>Power</template>
            </UInput>
          </UiFlex>
        </UFormGroup>

        <UFormGroup label="Phần thưởng">
          <UiFlex class="gap-1">
            <UInput v-model="stateAdd.gift.coin" type="number" >
              <template #trailing>Xu</template>
            </UInput>
            <UInput v-model="stateAdd.gift.exp" type="number" >
              <template #trailing>Tu vi</template>
            </UInput>
            <UInput v-model="stateAdd.gift.ecoin" type="number" >
              <template #trailing>ECoin</template>
            </UInput>
          </UiFlex>
        </UFormGroup>

        <UFormGroup label="Hiển thị">
          <SelectDisplay v-model="stateAdd.display" />
        </UFormGroup>

        <UiFlex class="mt-4">
          <SelectMissionDaily v-model="stateAdd.daily" class="mr-auto" />

          <UButton type="submit" :loading="loading.add">Thêm</UButton>
          <UButton color="gray" @click="modal.add = false" :disabled="loading.add" class="ml-1">Đóng</UButton>
        </UiFlex>
      </UForm>
    </UModal>

    <!-- Modal Edit -->
    <UModal v-model="modal.edit" preventClose>
      <UForm :state="stateEdit" @submit="editAction" class="p-4">
        <UFormGroup label="Tên">
          <UInput v-model="stateEdit.title" />
        </UFormGroup>

        <UFormGroup label="Mô tả">
          <UInput v-model="stateEdit.description" />
        </UFormGroup>

        <UFormGroup label="Yêu cầu" v-if="!!stateEdit.type">
          <UInput placeholder="Không cần điều kiện" disabled v-if="!!['pay.first', 'vip.upgrade'].includes(stateEdit.type)" />
          <SelectGamePrivate v-model="stateEdit.need" v-else-if="!!['game.private.play', 'game.private.comment', 'game.private.shopping'].includes(stateEdit.type)"/>
          <SelectGameTool v-model="stateEdit.need" v-else-if="!!['game.tool.buy', 'game.tool.comment'].includes(stateEdit.type)"/>
          <SelectGameChina v-model="stateEdit.need" v-else-if="!!['game.china.play', 'game.china.comment', 'game.china.pay.success'].includes(stateEdit.type)"/>
          <UInput v-model="stateEdit.need" v-else />
        </UFormGroup>

        <UFormGroup label="Điều kiện thêm" v-if="stateEdit.type == 'game.private.play'">
          <UiFlex class="gap-1">
            <UInput v-model="stateEdit.more.game.private.level" type="number" class="grow">
              <template #trailing>Level</template>
            </UInput>
            <UInput v-model="stateEdit.more.game.private.power" type="number" class="grow">
              <template #trailing>Power</template>
            </UInput>
          </UiFlex>
        </UFormGroup>

        <UFormGroup label="Phần thưởng">
          <UiFlex class="gap-1">
            <UInput v-model="stateEdit.gift.coin" type="number" >
              <template #trailing>Xu</template>
            </UInput>
            <UInput v-model="stateEdit.gift.exp" type="number" >
              <template #trailing>Tu vi</template>
            </UInput>
            <UInput v-model="stateEdit.gift.ecoin" type="number" >
              <template #trailing>ECoin</template>
            </UInput>
          </UiFlex>
        </UFormGroup>

        <UFormGroup label="Hiển thị">
          <SelectDisplay v-model="stateEdit.display" />
        </UFormGroup>

        <UiFlex class="mt-4">
          <SelectMissionDaily v-model="stateEdit.daily" class="mr-auto" />

          <UButton type="submit" :loading="loading.edit">Thêm</UButton>
          <UButton color="gray" @click="modal.edit = false" :disabled="loading.edit" class="ml-1">Đóng</UButton>
        </UiFlex>
      </UForm>
    </UModal>
  </UiContent>
</template>

<script setup>
const { toMoney } = useMoney()

// List
const list = ref([])

// Columns
const columns = [
  {
    key: 'type',
    label: 'Loại'
  },{
    key: 'title',
    label: 'Tên',
  },{
    key: 'description',
    label: 'Mô tả',
  },{
    key: 'gift',
    label: 'Phần thưởng',
  },{
    key: 'daily',
    label: 'Hằng ngày',
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
const stateAdd = ref({
  title: null,
  description: null, 
  type: null,
  expired: null,
  daily: false,
  need: null,
  more: {
    game: {
      private: {
        level: 0,
        power: 0
      }
    }
  },
  gift: {
    exp: 0,
    coin: 0,
    ecoin: 0,
  },
  display: true
})
watch(() => stateAdd.value.type, (val) => (stateAdd.value.need = null))

const stateEdit = ref({
  _id: null,
  title: null,
  description: null, 
  type: null,
  expired: null,
  daily: false,
  need: null,
  more: {
    game: {
      private: {
        level: 0,
        power: 0
      }
    }
  },
  gift: {
    exp: 0,
    coin: 0,
    ecoin: 0,
  },
  display: true
})

// Modal
const modal = ref({
  add: false,
  edit: false,
})

watch(() => modal.value.add, (val) => !val && (stateAdd.value = {
  title: null,
  description: null, 
  type: null,
  expired: null,
  daily: false,
  need: null,
  gift: {
    exp: 0,
    coin: 0,
    ecoin: 0,
  },
  display: true
}))

// Loading
const loading = ref({
  load: true,
  add: false,
  edit: false,
  del: false
})

// Type
const currencyFormat = {
  'coin': 'Xu',
  'exp': 'Tu vi',
  'ecoin': 'EC',
}

// Actions
const actions = (row) => [
  [{
    label: 'Sửa thông tin',
    icon: 'i-bx-pencil',
    click: () => {
      Object.keys(stateEdit.value).forEach(key => stateEdit.value[key] = row[key])
      modal.value.edit = true
    }
  }],[{
    label: 'Xóa nhiệm vụ',
    icon: 'i-bx-trash',
    click: () => delAction(row._id)
  }]
]
 
// Fetch
const getList = async () => {
  try {
    loading.value.load = true
    const data = await useAPI('mission/manage/list', JSON.parse(JSON.stringify(page.value)))

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
    await useAPI('mission/manage/add', JSON.parse(JSON.stringify(stateAdd.value)))

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
    await useAPI('mission/manage/edit', JSON.parse(JSON.stringify(stateEdit.value)))

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
    await useAPI('mission/manage/del', { _id })

    loading.value.del = false
    getList()
  }
  catch (e) {
    loading.value.del = false
  }
}

getList()
</script>
