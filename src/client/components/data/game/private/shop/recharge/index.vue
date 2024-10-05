<template>
  <DataEmpty v-if="!!game.paygame" class="h-[300px]" text="Trò chơi có thể nạp trực tiếp trong game" />

  <div v-else>
    <UiFlex class="mb-2 gap-1 flex-col sm:flex-row">
      <UForm :state="page" @submit="page.current = 1, getList()" class="w-full sm:w-auto">
        <UInput v-model="page.search" placeholder="Tìm kiếm..." icon="i-bx-search" size="sm" />
      </UForm>
    </UiFlex>

    <DataEmpty class="h-[300px]" text="Không có gói nạp" :loading="loading" v-if="!!loading || list.length == 0" />

    <div v-else>
      <div class="grid grid-cols-12 gap-2 md:gap-4">
        <UCard 
          v-for="(item, index) in list" :key="index" 
          class="md:col-span-3 col-span-6 cursor-pointer" 
          :ui="{
            divide: '',
            ring: 'ring-0',
            shadow: 'shadow hover:shadow-xl',
            body: {
              padding: 'px-4 py-4 sm:px-4 sm:py-4',
            },
          }"
          @click="startBuy(item)"
        >
          <UiFlex type="col" class="gap-2">
            <UAvatar icon="i-bx-package" size="3xl" />
            <UiText size="sm" weight="bold" color="primary" class="line-clamp-1">{{ item.recharge_name || 'Gói Nạp' }}</UiText>
            <UBadge size="xs" color="gray" class="px-3">{{ useMoney().toMoney(item.price) }}</UBadge>
          </UiFlex>
        </UCard>
      </div>

      <!-- Pagination -->
      <UiFlex justify="center" class="mt-4">
        <UPagination :max="5" :page-count="page.size" :total="page.total" v-model="page.current" size="2xs" />
      </UiFlex>
    </div>

    <UModal v-model="modal.buy" prevent-close>
      <DataGamePrivateShopRechargeBuy :recharge="rechargeSelect" :game="game" @close="modal.buy = false, emits('close')" @done="modal.buy = false, emits('done')" />
    </UModal>
  </div>
</template>

<script setup>
const props = defineProps(['game'])
const emits = defineEmits(['close', 'done'])

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

const rechargeSelect = ref(undefined)

const startBuy = (recharge) => {
  rechargeSelect.value = recharge
  modal.value.buy = true
}

const getList = async () => {
	try {
    if(!!props.game?.paygame) throw true
    loading.value = true
    const data = await useAPI('game/private/public/shop/recharge/list', JSON.parse(JSON.stringify(page.value)))

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