<template>
  <DataEmpty class="h-[300px]" text="Vui lòng đăng nhập trước" v-if="!authStore.isLogin" />

  <div v-else>
    <UForm
      ref="form" 
      :state="state" 
      :validate="validate" 
      @submit="submit" 
      class="grid grid-cols-12 gap-4 mb-4"
    >
      <div :class="{
        '2xl:col-span-6 col-span-12' : !fast,
        'col-span-12': !!fast
      }">
        <UCard :ui="{ body: { padding: 'pb-2 sm:pb-2'} }">
          <UiText weight="bold" class="mb-4">Chọn kênh nạp</UiText>

          <UFormGroup name="gate">
            <SelectGateImg v-model="state.gate" v-model:gate="gateSelect" />
          </UFormGroup>

          <div v-if="gateSelect && gateSelect.type != 1">
            <UFormGroup label="Nhập số tiền " name="money">
              <UInput v-model="state.money" type="number" placeholder="Nhỏ nhất 20.000" />
            </UFormGroup>
          </div>

          <div v-if="gateSelect && gateSelect.type == 1">
            <UiText align="center" class="mb-2" size="sm" weight="semibold" color="rose">Chú ý: Thẻ cào chỉ nhận được 80% số tiền nạp</UiText>

            <UFormGroup label="Chọn nhà mạng" name="card_net">
              <USelectMenu v-model="state.card.net" :options="card.net" value-attribute="value" size="lg" />
            </UFormGroup>

            <UFormGroup label="Chọn mệnh giá" name="card_money">
              <USelectMenu v-model="state.money" :options="card.money" value-attribute="value" size="lg" />
            </UFormGroup>

            <UFormGroup label="Nhập số seri" name="card_seri">
              <UInput v-model="state.card.seri" />
            </UFormGroup>

            <UFormGroup label="Nhập mã thẻ cào" name="card_pin">
              <UInput v-model="state.card.pin" />
            </UFormGroup>
          </div>
        </UCard>
      </div>

      <div :class="{
        '2xl:col-span-6 col-span-12' : !fast,
        'col-span-12': !!fast
      }">
        <UCard>
          <UiText weight="bold" class="mb-4">Thông tin thanh toán</UiText>

          <div class="mb-4">
            <UiFlex type="col" class="gap-4" v-if="gateSelect">
              <UiFlex justify="between" class="w-full">
                <UiText weight="semibold" color="gray" size="xs">{{ gateSelect.type == 1 ? 'Nhà mạng' : 'Kênh' }}</UiText>
                <UiText weight="semibold" size="sm">{{ gateSelect.type == 1 ? state.card.net || '...' : gateSelect.name }}</UiText>
              </UiFlex>

              <UiFlex justify="between" class="w-full">
                <UiText weight="semibold" color="gray" size="xs">{{ gateSelect.type == 1 ? 'Số Serial' : 'Tài khoản' }}</UiText>
                <UiFlex @click="startCopy(gateSelect.type == 1 ? state.card.seri || '...' : gateSelect.number)" class="cursor-pointer">
                  <UiText weight="semibold" size="sm">{{ gateSelect.type == 1 ? state.card.seri || '...' : gateSelect.number }}</UiText>
                  <UiIcon name="i-bx-copy-alt" color="primary" class="ml-2" pointer />
                </UiFlex>
              </UiFlex>

              <UiFlex justify="between" class="w-full">
                <UiText weight="semibold" color="gray" size="xs">{{ gateSelect.type == 1 ? 'Mã Pin' : 'Người nhận' }}</UiText>
                <UiFlex @click="startCopy(gateSelect.type == 1 ? state.card.pin || '...' : gateSelect.person)" class="cursor-pointer">
                  <UiText weight="semibold" size="sm">{{ gateSelect.type == 1 ? state.card.pin || '...' : gateSelect.person }}</UiText>
                  <UiIcon name="i-bx-copy-alt" color="primary" class="ml-2" pointer />
                </UiFlex>
              </UiFlex>

              <UiFlex justify="between" class="w-full">
                <UiText weight="semibold" color="gray" size="xs">Số tiền</UiText>
                <UiFlex @click="startCopy(state.money)" class="cursor-pointer">
                  <UiText weight="semibold" size="sm">{{ useMoney().toMoney(state.money) }}đ</UiText>
                  <UiIcon name="i-bx-copy-alt" color="primary" class="ml-2" pointer />
                </UiFlex>
              </UiFlex>

              <UiFlex justify="between" class="w-full" v-if="payment">
                <UiText weight="semibold" color="gray" size="xs">{{ gateSelect.type == 1 ? 'Mã giao dịch' : 'Nội dung' }}</UiText>
                <UiFlex @click="startCopy(payment.code)" class="cursor-pointer">
                  <UiText weight="semibold" size="sm">{{ payment.code }}</UiText>
                  <UiIcon name="i-bx-copy-alt" color="primary" class="ml-2" pointer />
                </UiFlex>
              </UiFlex>
              
              <UiFlex justify="center" class="w-full" v-if="!!payment && payment.qrcode">
                <UiImg :src="payment.qrcode" class="w-[200px] md:max-w-[80%]"/>
              </UiFlex>
            </UiFlex>

            <DataEmpty v-else />
          </div>

          <div>
            <UButton block type="submit" :loading="loading" v-if="!payment && !!gateSelect">Tạo Giao Dịch</UButton>
            <UButton block v-if="!!payment" color="blue" @click="reset">Tạo Mới</UButton>
          </div>
        </UCard>
      </div>
    </UForm>

    <div class="grid grid-cols-12">
      <DataPaymentHistory :reload="reloadHistory" class="col-span-12 !p-0" />
    </div>
  </div>
</template>

<script setup>
import { useClipboard } from '@vueuse/core'
const { copy, isSupported } = useClipboard()
const props = defineProps(['fast'])
const authStore = useAuthStore()
const form = ref()
const loading = ref(false)
const gateSelect = ref(undefined)
const payment = ref(undefined)
const reloadHistory = ref(0)

// State
const state = ref({
  gate: null,
  card: {
    pin: null,
    seri: null,
    net: null
  },
  money: null
})

const reset = () => {
  payment.value = null
  form.value.clear()
  state.value.card = {
    pin: null,
    seri: null,
    net: null
  }
  state.value.money = null
}

watch(() => state.value.gate, () => reset())

// Card
const card = {
  net:  [
    { label: 'Viettel', value: 'VIETTEL' },
    { label: 'Mobifone', value: 'MOBIFONE' },
    { label: 'Vinaphone', value: 'VINAPHONE' },
  ],
  money: [
    // { label: '10.000', value: 10000 },
    { label: '20.000', value: 20000 },
    { label: '30.000', value: 30000 },
    { label: '50.000', value: 50000 },
    { label: '100.000', value: 100000 },
    { label: '200.000', value: 200000 },
    { label: '300.000', value: 300000 },
    { label: '500.000', value: 500000 },
    { label: '1.000.000', value: 1000000 },
  ]
}

// Validate
const validate = (st) => {
  const errors = []
  if (!st.gate) errors.push({ path: 'gate', message: 'Vui lòng chọn kênh nạp' })
  if (!!gateSelect.value) {
    if(gateSelect.value['type'] == 1){
      if (!st.money) errors.push({ path: 'card_money', message: 'Vui lòng nhập đầy đủ' })
      if (!st.card.net) errors.push({ path: 'card_net', message: 'Vui lòng nhập đầy đủ' })
      if (!st.card.seri) errors.push({ path: 'card_seri', message: 'Vui lòng nhập đầy đủ' })
      if (!st.card.pin) errors.push({ path: 'card_pin', message: 'Vui lòng nhập đầy đủ' })
    }
    if(gateSelect.value['type'] != 1){
      if (!st.money) errors.push({ path: 'money', message: 'Vui lòng nhập đầy đủ' })
    }
  }
  return errors
}

// Copy
const startCopy = (text) => {
  if(!isSupported.value || !text) return
  copy(text)
  useNotify().success('Sao chép vào bộ nhớ tạm thành công')
}

// Submit
const submit = async () => {
  try {
    loading.value = true
    const pay = await useAPI('payment/public/create', JSON.parse(JSON.stringify(state.value)))

    payment.value = pay
    loading.value = false
    reloadHistory.value = reloadHistory.value + 1
  }
  catch (e) {
    loading.value = false
  }
}
</script>