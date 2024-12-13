<template>
  <UiContent title="Nâng VIP" sub="Nâng cấp tài khoản lên VIP" class="max-w-2xl mx-auto">
    <div class="grid grid-cols-12 gap-4">
      <UCard 
        class="
          xl:col-span-6 col-span-12 
          transition-2
          cursor-pointer select-none 
          overflow-hidden
        "
        :ui="{
          header: { background: item.bg }
        }" 
        v-for="(item, index) in list" :key="index"
        @click="select(item)"
      >
        <template #header>
          <UiFlex type="col" justify="center">
            <UiText align="center" weight="bold" size="lg">{{  item.title }}</UiText>
            <UiText align="center" size="sm">{{ item.des }}</UiText>
          </UiFlex>
        </template>

        <UiText align="center" weight="bold" :color="item.color" size="3xl" class="mt-6 mb-8">{{ useMoney().toMoney(item.price) }} Xu</UiText>

        <UDivider icon="i-bxs-star" class="mb-4" :ui="{ border: { base: 'dark:border-gray-700' }}"></UDivider>

        <UiFlex type="col" justify="center" class="gap-0.5">
          <UiText align="center" size="sm" color="gray" v-for="(info, i) in item.info" key="i">{{ info }}</UiText>
        </UiFlex>
      </UCard>
    </div>

    <UModal v-model="modal" prevent-close>
      <UiContent title="Nâng VIP" sub="Đơn hàng mua VIP" no-dot class="p-4">
        <template #more>
          <UButton icon="i-bx-x" class="ml-auto" size="2xs" color="gray" :disabled="!!loading" square @click="modal = false"></UButton>
        </template>

        <UForm ref="form">
          <UFormGroup label="Gói nâng cấp">
            <UInput :model-value="selectVip.title" readonly />
          </UFormGroup>

          <UFormGroup label="Giá Xu">
            <UInput :model-value="useMoney().toMoney(selectVip.price)" readonly />
          </UFormGroup>

          <UiFlex justify="end" class="mt-4">
            <UButton :loading="loading" :disabled="!!loading" @click="submit">Xác nhận</UButton>
          </UiFlex>
        </UForm>
      </UiContent>
    </UModal>
  </UiContent>
</template>

<script setup>
const configStore = useConfigStore()
useSeoMeta({
  title: () => `Nâng VIP - ${configStore.config.name}`,
  ogTitle: () => `Nâng VIP - ${configStore.config.name}`,
  description: () => 'Hệ thống nâng cấp tài khoản lên VIP',
  ogDescription: () => 'Hệ thống nâng cấp tài khoản lên VIP',
})

const authStore = useAuthStore()
const modal = ref(false)
const selectVip = ref(undefined)
const form = ref()
const loading = ref(false)

const list = ref([
  {
    title: 'VIP Tháng',
    des: 'Phí gia hạn 1 tháng',
    price: configStore.config.vip.month,
    info: [
      'Đặc quyền VIP 30 ngày',
      'Giảm 50% mua Tool tất cả các trò chơi',
      'Giảm 10% mua các tài nguyên Private'
    ],
    type: 'month',
    bg: 'bg-primary-500',
    color: 'primary'
  },
  {
    title: 'VIP Trọn Đời',
    des: 'Không cần kích hoạt lại',
    price: configStore.config.vip.forever,
    info: [
      'Đặc quyền VIP trọn đời',
      'Miễn phí mua Tool tất cả trò chơi',
      'Giảm 30% mua các tài nguyên Private'
    ],
    type: 'forever',
    bg: 'bg-rose-500',
    color: 'rose'
  }
])

const select = (vip) => {
  if(!authStore.isLogin) return useNotify().error('Vui lòng đăng nhập trước')
  selectVip.value = vip
  modal.value = true
}

const submit = async () => {
  try {
    loading.value = true
    await useAPI('user/public/vip/update', JSON.parse(JSON.stringify(selectVip.value)))

    loading.value = false
    modal.value = false
    await authStore.setAuth()
  }
  catch (e) {
    loading.value = false
  }
}
</script>