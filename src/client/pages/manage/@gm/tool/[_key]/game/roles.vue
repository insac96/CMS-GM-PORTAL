<template>
  <UiContent title="Nhân Vật" sub="Quản lý nhân vật trò chơi">
    <UiFlex class="mb-4 gap-1">
      <USelectMenu v-model="page.size" :options="[5,10,20,50,100]" :disabled="!page.server_id"/>

      <UForm :state="page" @submit="page.current = 1, getList()" class="mr-auto">
        <UiFlex>
          <UInput v-model="page.search.key" placeholder="Tìm kiếm..." icon="i-bx-search" size="sm" class="mr-1" :disabled="!page.server_id" />
          <USelectMenu v-model="page.search.by" :options="['USER', 'ROLE', 'ID']" :disabled="!page.server_id" />
        </UiFlex>
      </UForm>

      <UBadge color="gray" size="lg">{{ page.total }} <UIcon name="i-bxs-user" class="ml-1" /></UBadge>
      <SelectGameServer v-model="page.server_id" :game="game.code" v-model:server-data="serverData" type="tool" size="sm" />
    </UiFlex>
    
    <!-- Table -->
    <UCard :ui="{ body: { padding: 'p-0 sm:p-0' } }">
      <LoadingTable v-if="loading.load" />

      <UTable 
        v-model:sort="page.sort"
        :columns="selectedColumns"
        :rows="list"
      >
        <template #account-data="{ row }">
          <UButton size="2xs" color="gray" :disabled="!!loading.user">{{ row.account }}</UButton>
        </template>

        <template #power-data="{row}">
          {{ useMoney().toMoney(row.power) }}
        </template>

        <template #knb-data="{row}">
          {{ useMoney().toMoney(row.knb) }}
        </template>

        <template #coin-data="{row}">
          {{ useMoney().toMoney(row.coin) }}
        </template>

        <template #action-data="{row}">
          <UButton icon="i-bx-mail-send" color="gray" :disabled="!!loading.send" @click="openSend(row)" class="mr-1" />
          <UButton icon="i-bx-play" color="gray" :disabled="!!loading.play" @click="play(row)" />
        </template>
      </UTable>
    </UCard>

    <!-- Pagination -->
    <UiFlex justify="between" class="py-4">
      <USelectMenu v-model="selectedColumns"  :options="columns" multiple placeholder="Chọn cột" />
      <UPagination v-model="page.current" :page-count="page.size" :total="page.total" :max="5"/>
    </UiFlex>

    <!-- Modal Send -->
    <UModal v-model="modal.send" prevent-close :ui="{width: 'sm:max-w-[800px]'}">
      <UiContent title="Gửi Thư" sub="Gửi thư nhanh cho nhân vật" no-dot class="p-4">
        <template #more>
          <UButton icon="i-bx-x" class="ml-auto" size="2xs" color="gray" square @click="modal.send = false, resetStateSend()" :disabled="!!loading.send"></UButton>
        </template>

        <UForm :state="stateSend" @submit="send">
          <UFormGroup label="Máy chủ">
            <UInput :model-value="serverData.server_name" readonly />
          </UFormGroup>

          <UFormGroup label="Tài khoản">
            <UInput :model-value="stateSend.account" readonly />
          </UFormGroup>

          <UFormGroup label="Nhân vật">
            <UInput :model-value="stateSend.role_name" readonly />
          </UFormGroup>

          <UFormGroup label="Tiêu đề">
            <UInput v-model="stateSend.title" />
          </UFormGroup>

          <UFormGroup label="Nội dung">
            <UInput v-model="stateSend.content"  />
          </UFormGroup>

          <UFormGroup label="Vật Phẩm">
            <SelectGameToolItems v-model="stateSend.gift" :game="game.code" />
          </UFormGroup>

          <UiFlex justify="end" class="gap-1">
            <UButton type="submit" :loading="loading.send">Gửi</UButton>
            <UButton color="gray" @click="modal.send = false, resetStateSend()" :disabled="!!loading.send">Đóng</UButton>
          </UiFlex>
        </UForm>
      </UiContent>
    </UModal>
  </UiContent>
</template>

<script setup>
const game = useAttrs().game

// List
const list = ref([])
const serverData = ref(undefined)

// Columns
const columns = [
  {
    key: 'account',
    label: 'Tài khoản',
  },{
    key: 'role_id',
    label: 'ID',
  },{
    key: 'role_name',
    label: 'Tên',
  },{
    key: 'level',
    label: 'Cấp độ',
    sortable: true
  },{
    key: 'power',
    label: 'Lực chiến',
    sortable: true
  },{
    key: 'vip',
    label: 'VIP',
    sortable: true
  },{
    key: 'knb',
    label: 'Nguyên bảo',
    sortable: true
  },{
    key: 'coin',
    label: 'Kim tệ',
    sortable: true
  },{
    key: 'action',
    label: 'Chức năng'
  }
]
const selectedColumns = ref([...columns])

// Page
const page = ref({
  server_id: null,
  size: 10,
  current: 1,
  sort: {
    column: 'power',
    direction: 'desc'
  },
  search: {
    key: null,
    by: 'USER'
  },
  total: 0,
  game: game.code,
  type: 'tool'
})
watch(() => page.value.size, () => getList())
watch(() => page.value.current, () => getList())
watch(() => page.value.sort.column, () => getList())
watch(() => page.value.sort.direction, () => getList())
watch(() => page.value.search.key, (val) => !val && getList())
watch(() => page.value.server_id, () => getList())

// State
const stateSend = ref({
  account: null,
  role_id: null,
  role_name: null,
  server_id: null,
  title: 'Quản Trị Viên',
  content: 'Thư từ quản trị viên',
  gift: [],
  game: game.code
})

// Modal
const modal = ref({
  send: false
})

// Loading
const loading = ref({
  load: false,
  send: false,
  play: false
})

// Send
const openSend = async (row) => {
  stateSend.value.server_id = page.value.server_id
  stateSend.value.role_id = row.role_id
  stateSend.value.role_name = row.role_name
  stateSend.value.account = row.account
  modal.value.send = true
}

// Send
const send = async () => {
  try {
    loading.value.send = true
    await useAPI('game/tool/manage/project/vps/mail', JSON.parse(JSON.stringify(stateSend.value)))

    loading.value.send = false
    modal.value.send = false
    resetStateSend()
  }
  catch (e) {
    loading.value.send = false
  }
}

const resetStateSend = () => {
  stateSend.value = {
    account: null,
    role_id: null,
    role_name: null,
    server_id: null,
    title: 'Quản Trị Viên',
    content: 'Thư từ quản trị viên',
    gift: [],
    game: game.code
  }
}

// Play
const play = async (row) => {
  try {
    loading.value.play = true
    const data = await useAPI('game/tool/manage/project/vps/play', {
      account: row.account,
      server_id: page.value.server_id,
      role_id: row.role_id,
      game: game.code,
    })

    loading.value.play = false
    useTo().openNewTab(data)
  }
  catch (e) {
    loading.value.play = false
  }
}

// Fetch
const getList = async () => {
  try {
    loading.value.load = true
    const data = await useAPI('game/vps/roles', JSON.parse(JSON.stringify(page.value)))

    list.value = data.list
    page.value.total = data.total
    loading.value.load = false
  }
  catch (e) {
    loading.value.load = false
  } 
}
</script>
