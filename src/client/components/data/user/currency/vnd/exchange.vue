<template>
  <div>
    <slot :open="open"></slot>

    <UModal v-model="modal">
      <UiContent title="Đổi VND" sub="Chuyển đổi Xu thành VND (Phí 10%)" class="p-4">
        <template #more>
          <UButton icon="i-bx-x" class="ml-auto" size="2xs" color="gray" square :disabled="!!loading" @click="modal = false"></UButton>
        </template>

        <UForm :state="state" @submit="action">
          <UFormGroup label="Số dư Xu">
            <UInput :model-value="`${useMoney().toMoney(authStore.profile.currency.coin)}`" readonly />
          </UFormGroup>

          <UFormGroup label="Số dư VND">
            <UInput :model-value="`${useMoney().toMoney(authStore.profile.currency.vnd)}`" readonly />
          </UFormGroup>

          <UFormGroup label="Nhập số Xu chuyển">
            <UInput v-model="state.amount" type="number" />
          </UFormGroup>

          <UFormGroup label="Bạn nhận" v-if="!!totalVND">
            <UInput :model-value="`${useMoney().toMoney(totalVND)} VND`" readonly />
          </UFormGroup>

          <UiFlex justify="end" class="mt-4">
            <UButton type="submit" :loading="loading">Xác Nhận</UButton>
            <UButton color="gray" @click="modal = false" :disabled="!!loading" class="ml-1">Đóng</UButton>
          </UiFlex>
        </UForm>
      </UiContent>
    </UModal>
  </div>
</template>

<script setup>
const authStore = useAuthStore()
const modal = ref(false)
const loading = ref(false)

const open = () => {
  modal.value = true
}

const state = ref({
  amount: null
})

const totalVND = computed(() => {
  if(!state.value.amount) return null
  return Math.floor((Number(state.value.amount) * 90) / 100)
})

const action = async () => {
  try {
    loading.value = true
    await useAPI('user/public/currency/vnd/exchange', JSON.parse(JSON.stringify(state.value)))
    await authStore.setAuth()
    
    modal.value = false
    loading.value = false
  }
  catch(e){
    loading.value = false
  }
}
</script>