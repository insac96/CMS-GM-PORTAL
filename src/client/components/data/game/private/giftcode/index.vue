<template>
  <UiContent title="Giftcode" sub="Mã quà tặng trò chơi" no-dot>
    <template #more>
      <UButton icon="i-bx-x" square color="gray" class="ml-auto" size="xs" @click="emits('close')"></UButton>
    </template>

    <UForm ref="form" :state="state" :validate="validate" @submit="receive">
      <UFormGroup name="code">
        <UiFlex class="gap-1">
          <UInput class="grow" size="md" v-model="state.code" placeholder="Nhập mã tại đây" />
          <UButton size="md" :loading="loading.check" :disabled="!!loading.receive" color="black" @click="check">Kiểm tra</UButton>
        </UiFlex>
      </UFormGroup>

      <div v-if="!!giftcode">
        <UFormGroup label="Máy chủ" name="server_id">
          <SelectGameServer v-model="state.server_id" :game="game.code" type="private" />
        </UFormGroup>

        <UFormGroup label="Nhân vật" name="role_id" v-if="!!state.server_id">
          <SelectGameRole v-model="state.role_id" :server="state.server_id" :game="game.code" type="private" />
        </UFormGroup>

        <UFormGroup label="Giới hạn">
          <UInput :model-value="giftcode.limit == 0 ? 'Không giới hạn' : `${giftcode.limit} người`" readonly />
        </UFormGroup>

        <UFormGroup label="Sử dụng">
          <UInput :model-value="!!giftcode.justone ? 'Một lần duy nhất' : 'Một lần cho mỗi máy chủ'" readonly />
        </UFormGroup>

        <UFormGroup label="Phần thưởng" >
          <UCard :ui="{ body: { padding: 'p-2 sm:p-2' } }">
            <DataGamePrivateItemList :items="giftcode.gift" justify="center" />
          </UCard>
        </UFormGroup>
      </div>
      <UiFlex justify="between">
        <UButton icon="i-bx-time" @click="modal.history = true" color="gray">Lịch sử</UButton>
        <UButton type="submit" :loading="loading.receive" :disabled="!!loading.check" v-if="!!giftcode">Nhận Thưởng</UButton>
      </UiFlex>
    </UForm>
  </UiContent>
</template>

<script setup>
const props = defineProps(['game'])
const emits = defineEmits(['done', 'close'])
const giftcode = ref(undefined)
const form = ref()

const loading = ref({
  check: false,
  receive: false
})

const modal = ref({
  history: false
})

// State
const state = ref({
  code: null,
  server_id: null,
  role_id: null,
  game: props.game.key,
})

// Validate
const validate = (st) => {
  const errors = []
  if (!st.code) errors.push({ path: 'code', message: 'Vui lòng nhập đầy đủ' })
  return errors
}

// Action
const check = async () => {
  try {
    loading.value.check = true
    const data = await useAPI('game/private/public/giftcode/check', JSON.parse(JSON.stringify(state.value)))

    giftcode.value = data
    loading.value.check = false
  }
  catch (e) {
    giftcode.value = undefined
    loading.value.check = false
  }
}

const receive = async () => {
  try {
    loading.value.receive = true
    await useAPI('game/private/public/giftcode/receive', JSON.parse(JSON.stringify(state.value)))

    giftcode.value = null
    state.value.code = null
    
    setTimeout(() => {
      loading.value.receive = false
      emit('done')
    }, 1000)
  }
  catch (e) {
    loading.value.receive = false
  }
}
</script>