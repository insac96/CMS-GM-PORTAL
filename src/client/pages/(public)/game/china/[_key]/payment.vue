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
				<UFormGroup label="Nhập số tiền" name="coin">
					<UiFlex class="gap-1">
						<UInput class="grow" size="md" v-model="state.coin" type="number" placeholder="Nhỏ nhất 20.000" />
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
  coin: null,
	game: game.key
})

// Validate
const validate = (st) => {
  const errors = []
  if (!st.coin) errors.push({ path: 'coin', message: 'Vui lòng nhập đầy đủ' })
	else if (!!st.coin && st.coin < 20000) errors.push({ path: 'coin', message: 'Vui lòng nhập tối thiểu 20.000' })
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