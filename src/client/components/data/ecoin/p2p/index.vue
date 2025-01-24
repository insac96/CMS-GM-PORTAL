<template>
  <UCard>
    <DataEmpty class="min-h-[300px]" text="Khi tính năng ra mắt, bạn có thể bán Ecoin của mình cho những người chơi khác để kiếm thu nhập. Nó sẽ sớm có mặt ở phiên bản cập nhật tới. Hãy tích lũy ECoin của bạn nhé !!!" />
  </UCard>
  
  <!-- <div>
    <UiFlex class="mb-4">
      <UTabs v-model="tab" :items="tabs" :content="false" class="mr-auto"></UTabs>
      <UButton icon="i-bx-edit" size="lg" @click="modal.create = true" v-if="!!authStore.isLogin">Đăng Tin</UButton>
    </UiFlex>

    <DataEmpty :loading="loading.list" v-if="!!loading.list || list.length == 0" text="Không có thương gia nào bày bán" class="h-[300px]"></DataEmpty>
    <DataEcoinP2pList v-else :type="tabs[tab].key" :season="season" :list="list" @done="getList"/>

    <UiFlex justify="center" class="mt-4">
      <UPagination v-model="page.current" :page-count="page.size" :total="page.total" :max="4" size="xs" />
    </UiFlex>

    <UModal v-model="modal.create" preventClose>
      <UForm :state="stateCreate" @submit="createAction" class="p-4">
        <UFormGroup label="Bạn muốn">
          <USelectMenu 
            v-model="stateCreate.type" 
            size="lg" 
            value-attribute="value"
            placeholder="Chọn hành động"
            :options="[
              { label: 'Đăng Bán ECoin', value: 'buy' },
              { label: 'Đăng Mua ECoin', value: 'sell' },
            ]"
          ></USelectMenu>
        </UFormGroup>

        <UFormGroup label="Giá 1 ECoin thị trường" v-if="!!stateCreate.type">
          <UInput :model-value="`${season.price} đ`" readonly />
        </UFormGroup>

        <UFormGroup :label="`Giới hạn lượng ECoin ${stateCreate.type == 'buy' ? 'bán' : 'mua'} nhỏ nhất`" v-if="!!stateCreate.type">
          <UInput v-model="stateCreate.limit.start" type="number" />
        </UFormGroup>

        <UFormGroup :label="`Giới hạn lượng ECoin ${stateCreate.type == 'buy' ? 'bán' : 'mua'} lớn nhất`" v-if="!!stateCreate.type">
          <UInput v-model="stateCreate.limit.end" type="number" />
        </UFormGroup>

        <UiFlex justify="end" class="mt-4">
          <UButton type="submit" :loading="loading.create">Đăng</UButton>
          <UButton color="gray" @click="modal.create = false" :disabled="loading.create" class="ml-1">Đóng</UButton>
        </UiFlex>
      </UForm>
    </UModal>
  </div> -->
</template>

<script setup>
const season = useAttrs().season

const authStore = useAuthStore()
const configStore = useConfigStore()

useSeoMeta({
  title: () => `P2P - ${configStore.config.name}`,
  ogTitle: () => `P2P - ${configStore.config.name}`,
  description: () => 'Giao dịch tiền nền tảng ECoin giữa người chơi',
  ogDescription: () => 'Giao dịch tiền nền tảng ECoin giữa người chơi',
})

const tab = ref(0)
const tabs = [
  { label: 'Mua ECoin', key: 'buy' },
  { label: 'Bán ECoin', key: 'sell' }
]

const loading = ref({
  list: true,
  create: false,
})

const modal = ref({
  create: false
})
const stateCreate = ref({
  type: null,
  limit: {
    start: null,
    end: null
  }
})

const list = ref(undefined)
const page = ref({
  size: 5,
  current: 1,
  sort: {
    column: 'updatedAt',
    direction: 'asc'
  },
  total: 0
})

watch(() => tab.value, () => {
  if(page.value.current == 1) return getList()
  page.value.current = 1
})
watch(() => modal.value.create, (val) => !val && (stateCreate.value = {
  type: null,
  limit: {
    start: null,
    end: null
  }
}))
watch(() => page.value.current, () => getList())

const getList = async () => {
  try {
    loading.value.list = true

    const key = tabs[tab.value].key
    const data = await useAPI(`ecoin/public/p2p/${key}/list`, JSON.parse(JSON.stringify(page.value)))

    list.value = data.list
    page.value.total = data.total

    setTimeout(() => loading.value.list = false, 500)
  }
  catch(e){
    loading.value.list = false
  }
}

const createAction = async () => {
  try {
    if(!stateCreate.value.type) throw true
    const send = JSON.parse(JSON.stringify(stateCreate.value))
    const type = send.type

    loading.value.create = true
    await useAPI(`ecoin/public/p2p/${type}/create`, send)

    loading.value.create = false
    modal.value.create = false
    getList()
  }
  catch(e){
    loading.value.create = false
  }
}

// onMounted(() => setTimeout(getList, 1))
</script>