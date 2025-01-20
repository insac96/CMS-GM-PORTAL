<template>
  <UiFlex type="col" class="gap-2 md:gap-4">
    <UCard v-for="(item, index) in list" :key="index" class="w-full">
      <UiFlex justify="between" class="mb-2">
        <DataUserName :user="item.user" />
        <UiText color="gray" size="xs">{{ type == 'buy' ? 'đăng bán' : 'đăng mua' }}</UiText>
      </UiFlex>

      <UiFlex justify="between" class="gap-4">
        <div>
          <UiFlex items="end" class="gap-1 mb-2">
            <UiText size="3xl" weight="semibold">{{ useMoney().toMoney(season.price) }}</UiText>
            <UiText size="sm" weight="semibold">đ / Ecoin</UiText>
          </UiFlex>

          <UiFlex class="gap-2 mb-1">
            <UiText size="xs" color="gray">Khả dụng</UiText>
            <UiText size="xs">{{ useMoney().toMoney(item.user.currency.ecoin) }} ECoin</UiText>
          </UiFlex>

          <UiFlex class="gap-2">
            <UiText size="xs" color="gray">Giới hạn lệnh</UiText>
            <UiText size="xs">{{ useMoney().toMoney(item.limit.start) }} - {{ useMoney().toMoney(item.limit.end) }}</UiText>
          </UiFlex>
        </div>

        <UButton :color="type == 'buy' ? 'green' : 'rose'" size="xs" @click="open(item)" :disabled="!authStore.isLogin">
          {{ type == 'buy' ? 'Mua' : 'Bán' }} Ngay
        </UButton>
      </UiFlex>
    </UCard>

    <UModal v-model="modal">
      <UForm :state="state" @submit="action" class="p-4" v-if="!!select">
        <UFormGroup label="Loại giao dịch">
          <UInput :model-value="type == 'buy' ? 'Mua ECoin' : 'Bán ECoin'" readonly />
        </UFormGroup>

        <UFormGroup label="Giá 1 ECoin">
          <UInput :model-value="`${useMoney().toMoney(season.price)} đ`" readonly />
        </UFormGroup>

        <UFormGroup label="Giới hạn lệnh">
          <UInput :model-value="`${useMoney().toMoney(select.limit.start)} - ${useMoney().toMoney(select.limit.end)}`" readonly />
        </UFormGroup>

        <UFormGroup :label="`Nhập số lượng ECoin ${type == 'buy' ? 'mua' : 'bán'}`">
          <UInput v-model="state.amount" type="number" />
        </UFormGroup>

        <UFormGroup label="Bạn cần thanh toán" v-if="type == 'buy' && !!totalPrice">
          <UInput :model-value="`${useMoney().toMoney(totalPrice)} VND`" readonly />
        </UFormGroup>

        <UFormGroup label="Bạn nhận" v-if="type == 'sell' && !!totalPrice">
          <UInput :model-value="`${useMoney().toMoney(totalPrice)} VND`" readonly />
        </UFormGroup>

        <UiFlex justify="end" class="mt-4">
          <UButton type="submit" :loading="loading">Xác Nhận</UButton>
          <UButton color="gray" @click="modal = false" :disabled="loading" class="ml-1">Đóng</UButton>
        </UiFlex>
      </UForm>
    </UModal>
  </UiFlex>
</template>

<script setup>
const authStore = useAuthStore()
const props = defineProps(['season', 'type', 'list'])
const emits = defineEmits(['done'])

const modal = ref(false)
const loading = ref(false)
const select = ref(undefined)
const state = ref({
  _id: null,
  type: null,
  amount: null
})

const open = (item) => {
  select.value = item
  state.value._id = item._id
  state.value.type = props.type
  modal.value = true
}

const totalPrice = computed(() => {
  if(!select.value) return null
  if(!state.value.amount) return null
  return Math.round(Number(props.season.price) * Number(state.value.amount))
})

watch(() => modal.value, (val) => !val && (state.value = {
  _id: null,
  type: null,
  amount: null
}))

const action = async () => {
  try {
    loading.value = true
    const send = JSON.parse(JSON.stringify(state.value))

    await useAPI(`ecoin/public/p2p/${send.type}/transaction`, send)
    await authStore.setAuth()
    
    loading.value = false
    emits('done')
    modal.value = false
  }
  catch(e){
    loading.value = false
  }
}
</script>