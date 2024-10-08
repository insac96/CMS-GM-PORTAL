<template>
  <UiContent no-dot title="Sự Kiện" sub="Nhận thưởng sự kiện" class="p-4">
    <template #more>
      <UButton icon="i-bx-x" square color="gray" class="ml-auto" size="2xs" @click="emits('close')"></UButton>
    </template>

    <UForm :state="state" :validate="validate" @submit="receive">
      <UFormGroup label="Sự kiện" name="event">
        <UInput :model-value="typeFormat[event.type]" readonly/>
      </UFormGroup>

      <UFormGroup label="Mốc nhận" name="event">
        <UInput :model-value="useMoney().toMoney(event.need)" readonly/>
      </UFormGroup>

      <UFormGroup label="Máy chủ" name="server">
        <SelectGameServer v-model="state.server" :game="game.code" type="private" />
      </UFormGroup>

      <UFormGroup label="Nhân vật" name="role" v-if="!!state.server">
        <SelectGameRole v-model="state.role" :server="state.server" :game="game.code" type="private" />
      </UFormGroup>

      <UFormGroup label="Vật phẩm" name="gift">
        <DataGamePrivateItemList :items="event.gift" justify="center" size="50" :game="game.code" />
      </UFormGroup>

      <UiFlex justify="end" class="gap-1">
        <UButton type="submit" :loading="loading">Nhận</UButton>
        <UButton color="gray" :disabled="loading" @click="emits('close')">Đóng</UButton>
      </UiFlex>
    </UForm>
  </UiContent>
</template>

<script setup>
const props = defineProps(['game', 'event'])
const emits = defineEmits(['done','close'])
const loading = ref(false)

const state = ref({
  event: props.event?._id, 
  server: props.server,
  role: props.role,
  game: props.game?.code,
})

const typeFormat = {
  'login.week': 'Điểm Danh Tuần',
  'login.month': 'Điểm Danh Tháng',
  'login.total': 'Điểm Danh Tổng',

  'pay.day.coin': 'Tích Nạp Ngày',
  'pay.week.coin': 'Tích Nạp Tuần',
  'pay.month.coin': 'Tích Nạp Tháng',
  'pay.total.coin': 'Tích Nạp Tổng',
  'pay.running': 'Liên Nạp',
  'pay.musty': 'Đơn Nạp',
  
  'spend.day.gcoin': 'Tiêu Phí Ngày',
  'spend.week.gcoin': 'Tiêu Phí Tuần',
  'spend.month.gcoin': 'Tiêu Phí Tháng',
  'spend.total.gcoin': 'Tiêu Phí Tổng',
}

const validate = (state) => {
  const errors = []
  if (!state.server) errors.push({ path: 'server', message: 'Vui lòng chọn máy chủ' })
  if (!state.role) errors.push({ path: 'role', message: 'Vui lòng chọn nhân vật' })
  return errors
}

const receive = async () => {
  try {
    loading.value = true
    await useAPI('game/private/public/event/receive', JSON.parse(JSON.stringify(state.value)))

    loading.value = false
    emits('done')
	}
	catch(e){
    loading.value = false
  }
}
</script>