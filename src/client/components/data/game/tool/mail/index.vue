<template>
  <DataEmpty class="h-[300px]" text="Vui lòng mua tool để sử dụng" v-if="!game.tool?.mail " />

  <div v-else>
    <UForm :state="state" :validate="validate" @submit="send">
      <UFormGroup label="Máy chủ" name="server_id">
        <SelectGameServer v-model="state.server_id" :game="game.code" type="tool" />
      </UFormGroup>

      <UFormGroup label="Nhân vật" name="role_id" v-if="!!state.server_id">
        <SelectGameRole v-model="state.role_id" :server="state.server_id" :game="game.code" type="tool" />
      </UFormGroup>

      <UFormGroup label="Vật phẩm" name="items">
        <SelectGameToolItems v-model="state.items" :game="game.code" />
      </UFormGroup>

      <UiFlex justify="end" class="gap-1">
        <UButton type="submit" :loading="loading">Xác Nhận</UButton>
        <slot name="close" :loading="loading"></slot>
      </UiFlex>
    </UForm>
  </div>
</template>

<script setup>
const props = defineProps(['game'])
const emits = defineEmits(['close'])
const loading = ref(false)

const state = ref({
  server_id: props.server,
  role_id: props.role,
  items: [],
  game: props.game?.code
})

const validate = (state) => {
  const errors = []
  if (!state.server_id) errors.push({ path: 'server_id', message: 'Vui lòng chọn máy chủ' })
  if (!state.role_id) errors.push({ path: 'role_id', message: 'Vui lòng chọn nhân vật' })
  if (state.items.length == 0) errors.push({ path: 'items', message: 'Vui lòng chọn ít nhất 1 vật phẩm' })
  return errors
}

const send = async () => {
  try {
    loading.value = true
    await useAPI('game/tool/public/project/mail/send', JSON.parse(JSON.stringify(state.value)))

    loading.value = false
    emits('close')
	}
	catch(e){
    loading.value = false
  }
}
</script>