<template>
  <UiContent 
    title="Config VIP And Yuan" 
    sub="Chỉnh sửa cấu hình giá VIP và giá Nhân Dân Tệ" 
    class="max-w-3xl mx-auto"
  >
    <UCard class="mb-4">
      <UForm :state="state">
        <UFormGroup label="Giá mua VIP tháng">
          <UInput v-model="state.vip.month" />
        </UFormGroup>

        <UFormGroup label="Giá mua VIP trọn đời">
          <UInput v-model="state.vip.forever" />
        </UFormGroup>

        <UiFlex justify="end" class="mt-4">
          <UButton @click="update('vip')" :loading="updating">Cập nhật</UButton>
        </UiFlex>
      </UForm>
    </UCard>

    <UCard>
      <UForm :state="state">
        <UFormGroup :label="`Tỷ lệ quy đổi tệ (1 tệ = ${state.yuan} Xu)`">
          <UInput v-model="state.yuan" />
        </UFormGroup>

        <UiFlex justify="end" class="mt-4">
          <UButton @click="update('yuan')" :loading="updating">Cập nhật</UButton>
        </UiFlex>
      </UForm>
    </UCard>
  </UiContent>
</template>

<script setup>
const { bootConfig } = useConfigStore()

const load = ref(true)
const updating = ref(false)

const state = ref({
  change: null,
  
  yuan: 0,

  vip: {
    month: 0,
    forever: 0
  }
})

const getConfig = async () => {
  const config = await useAPI('config/manage/get')
  state.value = Object.assign(state.value, config)
  load.value = false
}

const update = async (change) => {
  try {
    updating.value = true
    state.value.change = change

    await useAPI('config/manage/update', JSON.parse(JSON.stringify(state.value)))
    bootConfig()
    getConfig()
    updating.value = false
  }
  catch(e) {
    updating.value = false
  }
}

getConfig()
</script>