<template>
  <UiContent no-dot title="Nạp Game" sub="Chức năng nạp gói trong game" class="p-4">
    <UForm :state="state" :validate="validate" @submit="send">
      <UFormGroup label="Máy chủ" name="server_id">
        <SelectGameServer v-model="state.server_id" :game="game.code" type="tool" />
      </UFormGroup>

      <UFormGroup label="Nhân vật" name="role_id" v-if="!!state.server_id">
        <SelectGameRole v-model="state.role_id" :server="state.server_id" :game="game.code" type="tool" />
      </UFormGroup>

      <UFormGroup label="Gói nạp">
        <UInput :model-value="recharge.recharge_name" readonly />
      </UFormGroup>

      <UiFlex justify="end" class="gap-1">
        <UButton type="submit" :loading="loading">Xác Nhận</UButton>
        <UButton color="gray" :disabled="loading" @click="emits('close')">Đóng</UButton>
      </UiFlex>
    </UForm>
  </UiContent>
</template>

<script setup>
const props = defineProps(['game', 'recharge', 'server', 'role'])
const emits = defineEmits(['close', 'done'])
const loading = ref(false)

const state = ref({
  recharge: props.recharge?._id,
  server_id: props.server,
  role_id: props.role,
  game: props.game?.code
})

const validate = (state) => {
  const errors = []
  if (!state.server_id) errors.push({ path: 'server_id', message: 'Vui lòng chọn máy chủ' })
  if (!state.role_id) errors.push({ path: 'role_id', message: 'Vui lòng chọn nhân vật' })
  return errors
}

const send = async () => {
  try {
    loading.value = true
    await useAPI('game/tool/public/recharge/send', JSON.parse(JSON.stringify(state.value)))

    loading.value = false
    emits('done', {
      type: 'recharge-done',
      source: props.recharge,
      recharge_id: props.recharge.recharge_id,
      server: props.server,
      role: props.role,
    })
	}
	catch(e){
    loading.value = false
  }
}
</script>