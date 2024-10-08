<template>
  <UiContent title="Nạp GCoin" sub="Chuyển Xu thành GCoin của trò chơi" no-dot>
    <template #more>
      <UButton icon="i-bx-x" square color="gray" class="ml-auto" size="2xs" @click="emits('close')"></UButton>
    </template>

    <UForm ref="form" :state="state" :validate="validate" @submit="submit">
      <UFormGroup label="Khuyến mãi">
        <UInput 
          size="md" 
          :model-value="`+ ${useRate().data(game.rate.payment).number}% GCoin nhận`" 
          readonly 
        />
      </UFormGroup>

      <UFormGroup label="Nhập số xu" name="coin">
        <UiFlex class="gap-1">
          <UInput class="grow" size="md" v-model="state.coin" type="number" />
          <UButton type="submit" size="md" :loading="loading" color="red">Xác Nhận</UButton>
        </UiFlex>
      </UFormGroup>

      <UFormGroup label="Lịch sử nạp">
        <DataGamePrivatePaymentHistory :game="props.game.code" :reload="reloadHistory" />
      </UFormGroup>
    </UForm>
  </UiContent>
</template>

<script setup>
const props = defineProps(['game'])
const emits = defineEmits(['done', 'close'])
const form = ref()
const loading = ref(false)
const reloadHistory = ref(0)

// State
const state = ref({
  coin: null,
	game: props.game.code
})

// Validate
const validate = (st) => {
  const errors = []
  if (!st.coin) errors.push({ path: 'coin', message: 'Vui lòng nhập đầy đủ' })
  return errors
}

// Submit
const submit = async () => {
  try {
    loading.value = true
    await useAPI('game/private/public/payment/create', JSON.parse(JSON.stringify(state.value)))
    loading.value = false
    state.value.coin = null
    reloadHistory.value = reloadHistory.value + 1
    emits('done')
  }
  catch (e) {
    loading.value = false
  }
}
</script>