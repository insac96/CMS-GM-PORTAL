<template>
  <UiContent no-dot title="Cửa Hàng Vật Phẩm" sub="Mua vật phẩm vào trong game" class="p-4">
    <template #more>
      <UButton icon="i-bx-x" square color="gray" class="ml-auto" size="xs" @click="emits('close')"></UButton>
    </template>

    <UForm :state="state" :validate="validate" @submit="buy">
      <UFormGroup label="Số dư GCoin" name="gcoin">
        <UInput :model-value="`${toMoney(game.user.currency.gcoin)}`" readonly/>
      </UFormGroup>

      <UFormGroup label="Máy chủ" name="server">
        <SelectGameServer v-model="state.server" :game="game.code" type="private" />
      </UFormGroup>

      <UFormGroup label="Nhân vật" name="role" v-if="!!state.server">
        <SelectGameRole v-model="state.role" :server="state.server" :game="game.code" type="private" />
      </UFormGroup>

      <UFormGroup label="Số lượng" name="amount">
        <UInput v-model="state.amount" type="number"/>
      </UFormGroup>

      <UFormGroup label="Thông tin đơn hàng" name="info">
        <UCard :ui="{ body: { padding: 'p-2 sm:p-2' } }">
          <UiFlex justify="between" class="text-sm font-semibold p-2">
            <UiText color="gray" class="mr-6">Mặt hàng</UiText>
            <UiText align="right">{{ shop.item.item_name }}</UiText>
          </UiFlex>

          <UiFlex justify="between" class="text-sm font-semibold p-2">
            <UiText color="gray" class="mr-6">Đơn giá</UiText>
            <UiText align="right">{{ toMoney(shop.price) }}</UiText>
          </UiFlex>

          <UiFlex justify="between" class="text-sm font-semibold p-2">
            <UiText color="gray" class="mr-6">Số lượng</UiText>
            <UiText align="right">x{{ state.amount }}</UiText>
          </UiFlex>

          <UiFlex justify="between" class="text-sm font-semibold p-2">
            <UiText color="gray" class="mr-6">Giảm giá</UiText>
            <UiText align="right">{{ useRate().data(game.rate.shop).number }}%</UiText>
          </UiFlex>

          <UiFlex justify="between" class="text-sm font-semibold p-2" v-if="!!totalPrice">
            <UiText color="gray" class="mr-6">Thành tiền</UiText>
            <UiText color="primary" weight="bold" align="right">{{ toMoney(totalPrice) }} GCoin</UiText>
          </UiFlex>
        </UCard>
      </UFormGroup>

      <UiFlex justify="end" class="gap-1">
        <UButton type="submit" :loading="loading">Mua</UButton>
        <UButton color="gray" :disabled="loading" @click="emits('close')">Đóng</UButton>
      </UiFlex>
    </UForm>
  </UiContent>
</template>

<script setup>
const { toMoney } = useMoney()
const props = defineProps(['game', 'shop', 'server', 'role'])
const emits = defineEmits(['done','close'])
const loading = ref(false)

const state = ref({
  shop: props.shop?._id, 
  server: props.server,
  role: props.role,
  game: props.game?.code,
  amount: 1
})

const validate = (state) => {
  const errors = []
  if (totalPrice.value == null) errors.push({ path: 'info', message: 'Không thể lấy thông tin giá tiền' })
  else if (totalPrice.value != null && props.game.user.currency.gcoin < totalPrice.value) errors.push({ path: 'gcoin', message: 'Số dư GCoin không đủ' })
  if (!state.server) errors.push({ path: 'server', message: 'Vui lòng chọn máy chủ' })
  if (!state.role) errors.push({ path: 'role', message: 'Vui lòng chọn nhân vật' })
  if (!state.amount) errors.push({ path: 'amount', message: 'Vui lòng nhập số lượng' })
  else if (state.amount < 1) errors.push({ path: 'amount', message: 'Số lượng không hợp lệ' })
  else if (state.amount > 1000) errors.push({ path: 'amount', message: 'Số lượng nhỏ hơn 1000' })
  return errors
}

const totalPrice = computed(() => {
  const amount = state.value.amount
  const price = props.shop.price
  const discount_system = useRate().data(props.game.rate.shop).number

  if(!amount || amount < 1) return null
  if(!price || price < 1) return null

  let discount = discount_system
  discount = discount > 100 ? 100 : discount

  let total = Math.floor(amount * price)
  total = total - Math.floor(total * discount / 100)
  return total
})

const buy = async () => {
  try {
    loading.value = true
    await useAPI('game/private/public/shop/item/buy', JSON.parse(JSON.stringify(state.value)))

    loading.value = false
    emits('done')
	}
	catch(e){
    loading.value = false
  }
}
</script>