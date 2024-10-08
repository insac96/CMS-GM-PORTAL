<template>
  <div>
    <UiFlex justify="center">
      <UTabs v-model="tab" :items="tabs" class="mt-2"></UTabs>
    </UiFlex>

    <!-- Table -->
		<div>
			<LoadingTable v-if="loading" />

			<UTable :columns="columns" :rows="list">
				<template #need-data="{ row }">
					<UiText weight="semibold">{{ toMoney(row.need) }}</UiText>
				</template>

				<template #gift-data="{ row }">
					<DataGamePrivateItemList :items="row.gift" class="max-w-[300px]" :size="45" :game="game.code" />
				</template>

				<template #actions-data="{ row }">
					<UButton 
            size="xs"
            :color="statusFormat[row.status].color"
            :disabled="row.status != 0"
            @click="openReceive(row)"
          >{{ statusShow(row.status, row.need) }}</UButton>
				</template>
			</UTable>
		</div>

    <UModal v-model="modal.receive" prevent-close>
      <DataGamePrivateEventReceive 
        :event="stateReceive" 
        :game="game" 
        @close="modal.receive = false"
        @done="doneReceive" 
      />
    </UModal>
  </div>
</template>

<script setup>
const props = defineProps(['game'])
const emits = defineEmits(['start-receive'])

const authStore = useAuthStore()
const { toMoney } = useMoney()

const loading = ref(true)
const modal = ref({
  receive: false
})

const list = ref([])
const statistical = computed(() => props.game.user)

const type = ref('spend.day.gcoin')
watch(() => type.value, () => getList())

const tab = ref(0)
const tabs = [
  { label: 'Ngày', key: 'spend.day.gcoin' },
  { label: 'Tuần', key: 'spend.week.gcoin' },
  { label: 'Tháng', key: 'spend.month.gcoin' },
  { label: 'Tổng', key: 'spend.total.gcoin' },
]
watch(() => tab.value, (val) => type.value = tabs[val]['key'])

const columns = [{
  key: 'need',
  label: 'Mốc',
},{
  key: 'gift',
  label: 'Thưởng',
},{
  key: 'actions'
}]

const statusFormat = {
  '99': { color: 'gray', label: 'Lỗi' },
  '-3': { color: 'gray', label: 'Chưa đăng nhập' },
  '-2': { color: 'gray', label: 'Chưa đăng ký' },
  '-1': { color: 'gray', label: 'Chưa đạt' },
  '0': { color: 'primary', label: 'Nhận' },
  '1': { color: 'gray', label: 'Đã nhận' },
}

const statusShow = (number, need) => {
  if(number != -1 || !authStore.isLogin) return statusFormat[number].label

  const arrType = type.value.split('.')
  if(arrType.length > 1){
    let info = JSON.parse(JSON.stringify(statistical.value)) 
    arrType.forEach(i => info = info[i])
    return `${toMoney(info)} / ${toMoney(need)}`
  }
  else {
    return `${toMoney(statistical.value[type.value])} / ${toMoney(need)}`
  }
}

const stateReceive = ref(null)

const openReceive = (row) => {
  emits('start-receive')
  stateReceive.value = row
  modal.value.receive = true
}

const doneReceive = () => {
  modal.value.receive = false
  getList()
  emit('done')
}

const getList = async () => {
  try {
    loading.value = true
    const get = await useAPI('game/private/public/event/list', { 
      type: type.value,
      game: props.game.code
    })

    list.value = get.list
    loading.value = false
  }
  catch(e){
    list.value = []
    loading.value = false
  }
}

watch(() => authStore.isLogin, () => getList())
onMounted(() => setTimeout(getList, 1))
</script>