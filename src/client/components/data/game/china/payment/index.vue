<template>
	<UiContent title="Nạp Tệ" sub="Nạp tệ vào nền tảng trò chơi" no-dot>
		<template #more>
			<UButton icon="i-bx-x" square color="gray" class="ml-auto" size="2xs" @click="emits('close')"></UButton>
		</template>

		<UForm ref="form" :state="state" :validate="validate" @submit="submit">
			<UFormGroup label="Chọn số lượng tệ nạp" name="coin" help="Sử dụng tiền nền tảng có thể mua các gói nạp trong trò chơi">
				<UiFlex class="gap-1">
					<USelectMenu v-model="state.coin" :options="moneys" value-attribute="value" size="md" class="grow" />

					<UButton type="submit" size="md" :loading="loading">Xác Nhận</UButton>
				</UiFlex>
			</UFormGroup>

			<UFormGroup label="Lịch sử nạp">
				<DataGameChinaPaymentHistory :game="game.key" :reload="reloadHistory" />
			</UFormGroup>
		</UForm>
	</UiContent>
</template>

<script setup>
const props = defineProps(['game'])
const emits = defineEmits(['close'])
const authStore = useAuthStore()
const form = ref()
const loading = ref(false)
const reloadHistory = ref(0)

// State
const state = ref({
  coin: 3500,
	game: props.game.key
})

// Moneys
const moneys = [
	{ label: `1 tệ - ${3500} Xu`, value: 3500 },
	{ label: `5 tệ - ${3500 * 5} Xu`, value: 3500 * 5 },
	{ label: `10 tệ - ${3500 * 10} Xu`, value: 3500 * 10 },
	{ label: `20 tệ - ${3500 * 20} Xu`, value: 3500 * 20 },
	{ label: `30 tệ - ${3500 * 30} Xu`, value: 3500 * 30 },
	{ label: `50 tệ - ${3500 * 50} Xu`, value: 3500 * 50 },
	{ label: `100 tệ - ${3500 * 100} Xu`, value: 3500 * 100 },
]

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
    await useAPI('game/china/public/payment/create', JSON.parse(JSON.stringify(state.value)))
		await authStore.setAuth()

    loading.value = false
    reloadHistory.value = reloadHistory.value + 1
  }
  catch (e) {
    loading.value = false
  }
}
</script>