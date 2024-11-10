<template>
  <div>
    <UiFlex class="mb-2 gap-1" justify="between">
      <UForm :state="page" @submit="page.current = 1, getList()" class="w-full sm:w-auto">
        <UInput v-model="page.search" placeholder="Tìm kiếm..." icon="i-bx-search" size="sm" />
      </UForm>

      <UButtonGroup v-if="game.user">
        <UButton square icon="i-bx-coin-stack" />
        <UButton color="gray">{{ useMoney().toMoney(authStore.profile.currency.coin) }}</UButton>
      </UButtonGroup>
    </UiFlex>

    <DataEmpty class="h-[300px]" text="Không có vật phẩm bày bán" :loading="loading" v-if="!!loading || list.length == 0" />

    <div v-else>
      <div class="grid grid-cols-12 gap-2 md:gap-4">
        <UCard 
          v-for="(shop, index) in list" :key="index" 
          class="md:col-span-3 col-span-6 cursor-pointer transition-2" 
          :ui="{
            divide: '',
            ring: 'ring-0 dark:ring-1 dark:ring-gray-800',
            shadow: 'shadow hover:shadow-xl',
            body: {
              padding: 'px-4 py-4 sm:px-4 sm:py-4',
            },
          }"
          @click="startBuy(shop)"
        >
          <UiFlex type="col" class="gap-2">
            <UiText size="sm" weight="bold" color="primary" class="line-clamp-1">{{ shop.name || 'Gói Vật Phẩm' }}</UiText>

            <DataGamePrivateItemList :items="shop.gift" justify="center" size="50" class="my-3" :max="2" :game="game.code"/>

            <UiText size="xs" weight="bold" class="line-clamp-1" color="gray">{{ shop.gift.length }} vật phẩm</UiText>
            
            <UButtonGroup size="2xs" class="mt-0.5">
              <UButton square icon="i-bx-coin" />
              <UButton color="gray">{{ useMoney().toMoney(shop.price) }}</UButton>
            </UButtonGroup>
          </UiFlex>
        </UCard>
      </div>

      <!-- Pagination -->
      <UiFlex justify="center" class="mt-3" v-if="page.total > page.size">
        <UPagination :max="5" :page-count="page.size" :total="page.total" v-model="page.current" />
      </UiFlex>
    </div>

    <UModal v-model="modal.buy" prevent-close>
      <DataGamePrivateShopPackBuy :shop="shopSelect" :game="game" @close="modal.buy = false" @done="modal.buy = false, emits('done')" />
    </UModal>
  </div>
</template>

<script setup>
const authStore = useAuthStore()
const props = defineProps(['game'])
const emits = defineEmits(['done'])

const list = ref([])
const loading = ref(true)

const modal = ref({
  buy: false
})

const page = ref({
  size: 12,
  current: 1,
  sort: {
    column: 'price',
    direction: 'asc'
  },
  search: null,
  total: 0,
  game: props.game?.code
})
watch(() => page.value.current, () => getList())
watch(() => page.value.search, (val) => !val && getList())

const shopSelect = ref(undefined)

const startBuy = (shop) => {
  if(!authStore.isLogin) return authStore.setModal(true)
  if(!props.game.user) return useNotify().error('Vui lòng đăng ký chơi trước')
  shopSelect.value = shop
  modal.value.buy = true
}

const getList = async () => {
	try {
    loading.value = true
    const data = await useAPI('game/private/public/shop/pack/list', JSON.parse(JSON.stringify(page.value)))

    list.value = data.list
    page.value.total = data.total
    loading.value = false
	}
	catch(e){
    loading.value = false
  }
}

onMounted(() => setTimeout(getList, 1))
</script>