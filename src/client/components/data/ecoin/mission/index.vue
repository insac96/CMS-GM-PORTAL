<template>
  <UCard :ui="{ body: { padding: 'py-0 sm:py-0'}}">
    <DataEmpty :loading="loading.list" text="Hiện tại chưa có nhiệm vụ" class="min-h-[300px]" v-if="!!loading.list || list.length == 0" />

    <div class="divide-y divide-gray-100 dark:divide-gray-800" v-else>
      <UiFlex v-for="(item, index) in listFormat" :key="index" justify="between" class="gap-2 py-4">
        <div>
          <UiText weight="semibold" class="md:text-base text-sm mb-0.5">{{ item.title }}</UiText>

          <UiText color="gray" class="md:text-sm text-xs">{{ item.description }}</UiText>

          <UiFlex wrap class="gap-1 mt-2">
            <div v-for="(value, key) in item.gift" :key="key">
              <UBadge color="gray">
                <UiText weight="bold" :color="value > 0 ? 'primary' : 'gray'" class="mr-1">{{ toMoney(value) }}</UiText>
                {{ currencyFormat[key] }} 
              </UBadge>
            </div>
          </UiFlex>
        </div>

        <UButton 
          :disabled="item.status != 0 || !!loading.check" 
          :color="statusFormat[item.status].color"
          :loading="!!loading.check && missionSelect == item._id"
          size="xs"
          @click="checkMission(item._id)"
        >{{ statusFormat[item.status].text }}</UButton>
      </UiFlex>
    </div>
  </UCard>
</template>

<script setup>
const { toMoney } = useMoney()
const authStore = useAuthStore()
const loading = ref({
  list: true,
  check: false
})
const list = ref([])
const missionSelect = ref(undefined)

const currencyFormat = {
  'coin': 'Xu',
  'exp': 'Tu Vi',
  'ecoin': 'ECoin',
}

const statusFormat = {
  '-1' : { text: 'Chưa đăng nhập', color: 'gray' },
  '0'  : { text: 'Kiểm tra', color: 'primary' },
  '1'  : { text: 'Đã nhận', color: 'gray' },
  '99' : { text: 'Lỗi', color: 'gray' },
}

const listFormat = computed(() => {
  return list.value.sort((a, b) => a.status - b.status)
})

const checkMission = async (_id) => {
  try {
    missionSelect.value = _id
    loading.value.check = true
    
    const status = await useAPI('mission/public/check', { mission: _id })
    const index = list.value.findLastIndex(i => i._id == _id)
    if(index != -1) list.value[index]['status'] = status
    
    loading.value.check = false
  }
  catch(e){
    loading.value.check = false
  }
}

const getList = async () => {
  try {
    loading.value.list = true
    const data = await useAPI('mission/public/list')

    list.value = data
    setTimeout(() => loading.value.list = false, 500)
  }
  catch(e){
    loading.value.list = false
  }
}

watch(() => authStore.isLogin, () => getList())
onMounted(() => setTimeout(getList, 1))
</script>