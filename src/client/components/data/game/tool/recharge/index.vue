<template>
  <DataEmpty 
    v-if="!game.tool?.recharge || !!game.paygame"
    class="h-[300px]" 
    :text="!game.tool?.recharge ? 'Vui lòng mua tool để sử dụng' : 'Trò chơi có thể nạp trực tiếp trong game'" 
  />
  
  <div v-else>
    <UiFlex class="mb-2 gap-1 flex-col sm:flex-row">
      <UForm :state="page" @submit="page.current = 1, getList()" class="w-full sm:w-auto">
        <UInput v-model="page.search" placeholder="Tìm kiếm..." icon="i-bx-search" size="sm" />
      </UForm>
    </UiFlex>

    <div v-if="!loading.list">
      <DataEmpty class="h-[300px]" text="Không có gói nạp" v-if="list.length == 0" />

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
              <UAvatar icon="i-bx-package" alt="Benjamin Canac" size="3xl" />
              <UiText size="sm" weight="semibold" color="gray" class="line-clamp-1">{{ item.recharge_name || 'Gói Nạp' }}</UiText>
            </UiFlex>
          </UCard>
        </div>
      </div>
    </div>

    <UModal v-model="modal.buy" prevent-close>
      <DataGameToolRechargeBuy :recharge="rechargeSelect" :game="game" @close="modal.buy = false" />
    </UModal>
  </div>
</template>

<script setup>
const props = defineProps(['game'])
const list = ref([])
const loading = ref({
  list: true
})
const modal = ref({
  buy: false
})
const page = ref({
  size: 12,
  current: 1,
  sort: {
    column: 'recharge_id',
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
    loading.value.list = true
    const data = await useAPI('game/tool/public/project/recharge/list', JSON.parse(JSON.stringify(page.value)))

    list.value = data.list
    page.value.total = data.total
    loading.value.list = false
	}
	catch(e){
    loading.value.list = false
  }
}

onMounted(() => {
  setTimeout(getList, 1)
})
</script>