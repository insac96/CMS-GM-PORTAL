<template>
	<div v-if="game">
		<div v-if="!authStore.isLogin">
			<DataEmpty class="h-[300px]" text="Vui lòng đăng nhập trước" />
		</div>

		<div v-else>
			<div v-if="!game.user">
				<DataEmpty class="h-[300px]" text="Vui lòng chơi game trước khi nạp" />
			</div>

			<UForm v-else ref="form" :state="state" :validate="validate" @submit="submit">
				<UFormGroup label="Chọn số lượng tệ nạp" name="coin" help="Sử dụng tiền nền tảng có thể mua các gói nạp trong trò chơi">
					<UiFlex class="gap-1">
						<USelectMenu v-model="state.coin" :options="moneys" value-attribute="value" size="md" class="grow" />

						<UButton type="submit" size="md" :loading="loading" color="red">Xác Nhận</UButton>
					</UiFlex>
				</UFormGroup>

				<UFormGroup label="Lịch sử nạp">
					<DataGameChinaPaymentHistory :game="game.key" :reload="reloadHistory" />
				</UFormGroup>
			</UForm>
		</div>
	</div>
</template>

<script setup>
const game = useAttrs().game
const authStore = useAuthStore()
const form = ref()
const loading = ref(false)
const reloadHistory = ref(0)

// State
const state = ref({
  coin: 3500,
	game: game.key
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