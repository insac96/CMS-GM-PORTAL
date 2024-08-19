<template>
  <div>
    <DataUserBox :fetch-id="user" v-model:user-data="userData">
      <template #more>
        <UDropdown :items="actions()" v-if="!!userData && !route.params._secret">
          <UButton color="gray" icon="i-bx-dots-horizontal-rounded" />
        </UDropdown>
      </template>
    </DataUserBox>

    <div class="px-4 pb-2">
      <UAccordion
        color="primary"
        variant="soft"
        size="md"
        :items="menu"
      >
        <template #default="{ item, open }">
          <UButton :color="open ? 'primary' : 'gray'" size="md" class="mb-2">
            {{ item.label }}
          </UButton>
        </template>

        <template #log>
          <ManageUserLog :user="user" />
        </template>

        <template #ip>
          <ManageUserIp :user="user" />
        </template>

        <template #payment>
          <DataPaymentHistory :user="user" />
        </template>
      </UAccordion>
    </div>

    <!-- Modal Edit Auth-->
    <UModal v-model="modal.editAuth" preventClose>
      <UForm :state="stateEditAuth" @submit="editAuthAction" class="p-4">
        <UFormGroup label="Email">
          <UInput v-model="stateEditAuth.email" />
        </UFormGroup>

        <UFormGroup label="Số điện thoại">
          <UInput v-model="stateEditAuth.phone" />
        </UFormGroup>

        <UFormGroup label="Mật khẩu">
          <UInput v-model="stateEditAuth.password" type="password" />
        </UFormGroup>

        <UFormGroup label="Khóa">
          <SelectAuthBlock v-model="stateEditAuth.block" />
        </UFormGroup>

        <UFormGroup label="Quyền">
          <SelectAuthType v-model="stateEditAuth.type" />
        </UFormGroup>

        <UiFlex justify="end" class="mt-6">
          <UButton type="submit" :loading="loading.editAuth">Sửa</UButton>
          <UButton color="gray" @click="modal.editAuth = false" :disabled="loading.editAuth" class="ml-1">Đóng</UButton>
        </UiFlex>
      </UForm>
    </UModal>

    <!-- Modal Edit Currency-->
    <UModal v-model="modal.editCurrency" preventClose>
      <UForm :state="stateEditCurrency" @submit="editCurrencyAction" class="p-4">
        <UFormGroup label="Xu Web">
          <UInput v-model="stateEditCurrency.plus.coin" type="number" v-if="stateEditCurrency.type == 'plus'" />
          <UInput v-model="stateEditCurrency.origin.coin" type="number" v-if="stateEditCurrency.type == 'origin'" />
        </UFormGroup>

        <UFormGroup label="Lý do">
          <UTextarea v-model="stateEditCurrency.reason" />
        </UFormGroup>

        <UiFlex justify="end" class="mt-6">
          <UButton type="submit" :loading="loading.editCurrency">
            {{ stateEditCurrency.type == 'plus' ? 'Thêm' : 'Sửa' }}
          </UButton>
          <UButton color="gray" @click="modal.editCurrency = false" :disabled="loading.editCurrency" class="ml-1">Đóng</UButton>
        </UiFlex>
      </UForm>
    </UModal>
  </div>
</template>

<script setup>
const props = defineProps(['user'])

const route = useRoute()

const userData = ref(null)

const menu = [
  {
    label: 'Dòng thời gian',
    slot: 'log'
  },
  {
    label: 'Địa chỉ IP',
    slot: 'ip'
  },
  {
    label: 'Nạp tiền',
    slot: 'payment'
  }
]

// Modal
const modal = ref({
  editAuth: false,
  editCurrency: false
})

// Loading
const loading = ref({
  editAuth: false,
  editCurrency: false,
})

// Stage
const stateEditAuth = ref({
  _id: null,
  email: null,
  phone: null,
  password: null,
  type: null,
  block: null
})

const stateEditCurrency = ref({
  type: null,
  plus: {
    coin: 0
  },
  origin: {
    coin: null
  },
  reason: null
})


// Watch
watch(() => modal.value.editCurrency, (val) => !val && (stateEditCurrency.value = {
  type: null,
  plus: {
    coin: 0
  },
  origin: {
    coin: null
  },
  reason: null
}))

// Action
const actions = () => [
  [{
    label: 'Sửa thông tin',
    icon: 'i-bx-pencil',
    click: () => {
      Object.keys(stateEditAuth.value).forEach(key => stateEditAuth.value[key] = userData.value[key])
      modal.value.editAuth = true
    }
  }],[{
    label: 'Thêm tiền tệ',
    icon: 'i-bx-coin-stack',
    click: () => {
      stateEditCurrency.value._id = userData.value._id
      stateEditCurrency.value.type = 'plus'
      modal.value.editCurrency = true
    }
  },{
    label: 'Sửa tiền tệ',
    icon: 'i-bx-coin',
    click: () => {
      Object.keys(stateEditCurrency.value.origin).forEach(key => stateEditCurrency.value.origin[key] = userData.value['currency'][key])
      stateEditCurrency.value._id = userData.value._id
      stateEditCurrency.value.type = 'origin'
      modal.value.editCurrency = true
    }
  }]
]

const editAuthAction = async () => {
  try {
    loading.value.editAuth = true
    await useAPI('user/manage/editAuth', JSON.parse(JSON.stringify(stateEditAuth.value)))

    loading.value.editAuth = false
    modal.value.editAuth = false
  }
  catch (e) {
    loading.value.editAuth = false
  }
}

const editCurrencyAction = async () => {
  try {
    loading.value.editCurrency = true
    await useAPI('user/manage/editCurrency', JSON.parse(JSON.stringify(stateEditCurrency.value)))

    loading.value.editCurrency = false
    modal.value.editCurrency = false
  }
  catch (e) {
    loading.value.editCurrency = false
  }
}
</script>