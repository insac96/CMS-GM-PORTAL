<template>
  <UiContent 
    title="Config Page" 
    sub="Chỉnh sửa thông tin trang" 
    class="max-w-3xl mx-auto"
  >
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

      <template #basic>
        <UCard>
          <UForm :state="state">
            <UFormGroup label="Tên trang">
              <UInput v-model="state.name" />
            </UFormGroup>

            <UFormGroup label="Tên viết tắt">
              <UInput v-model="state.short_name" />
            </UFormGroup>

            <UFormGroup label="Mô tả">
              <UTextarea autoresize v-model="state.description" name="input" />
            </UFormGroup>

            <UFormGroup label="Logo">
              <UiUploadImage v-model="state.logo_image">
                <template #default="{ select, loading }">
                  <UInput :model-value="state.logo_image" :loading="loading" readonly @click="select"/>
                </template>
              </UiUploadImage>
            </UFormGroup>

            <UFormGroup label="Banner">
              <UiUploadImage v-model="state.og_image">
                <template #default="{ select, loading }">
                  <UInput :model-value="state.og_image" :loading="loading" readonly @click="select"/>
                </template>
              </UiUploadImage>
            </UFormGroup>

            <UFormGroup label="Windows Mini Client">
              <UInput v-model="state.download.windows" />
            </UFormGroup>

            <UFormGroup label="Mac Mini Client">
              <UInput v-model="state.download.mac" />
            </UFormGroup>

            <UiFlex justify="end" class="mt-4">
              <UButton @click="update('basic')" :loading="updating">Cập nhật</UButton>
            </UiFlex>
          </UForm>
        </UCard>
      </template>

      <template #contact>
        <UCard>
          <UForm :state="state">
            <UFormGroup label="Tên tổ chức">
              <UInput v-model="state.contact.name" />
            </UFormGroup>

            <UFormGroup label="Tên viết tắt">
              <UInput v-model="state.contact.prefix" />
            </UFormGroup>

            <UFormGroup label="Số điện thoại">
              <UInput v-model="state.contact.phone" />
            </UFormGroup>

            <UFormGroup label="Hòm thư">
              <UInput v-model="state.contact.email"/>
            </UFormGroup>

            <UFormGroup label="Địa chỉ">
              <UInput v-model="state.contact.address" />
            </UFormGroup>

            <UiFlex justify="end" class="mt-4">
              <UButton @click="update('contact')" :loading="updating">Cập nhật</UButton>
            </UiFlex>
          </UForm>
        </UCard>
      </template>

      <template #social>
        <UCard>
          <UForm :state="state">
            <UFormGroup label="Facebook">
              <UInput v-model="state.social.facebook" />
            </UFormGroup>

            <UFormGroup label="Messenger">
              <UInput v-model="state.social.messenger" />
            </UFormGroup>

            <UFormGroup label="Zalo">
              <UInput v-model="state.social.zalo" />
            </UFormGroup>

            <UFormGroup label="Telegram">
              <UInput v-model="state.social.telegram" />
            </UFormGroup>

            <UFormGroup label="Tiktok">
              <UInput v-model="state.social.tiktok" />
            </UFormGroup>

            <UiFlex justify="end" class="mt-4">
              <UButton @click="update('social')" :loading="updating">Cập nhật</UButton>
            </UiFlex>
          </UForm>
        </UCard>
      </template>

      <template #other>
        <UCard>
          <UiFlex justify="between">
            <UInput size="sm" class="w-[80px] grow mr-1" v-model="state.manage_password" type="password" />
            <UButton @click="action('change-manage-password')">Lưu Thay Đổi</UButton>
          </UiFlex>
        </UCard>
      </template>
    </UAccordion>
  </UiContent>
</template>

<script setup>
const { bootConfig } = useConfigStore()
const { error } = useNotify()

const load = ref(true)
const updating = ref(false)

const state = ref({
  change: null,

  name: '',
  short_name: '',
  description: '',
  og_image: '',
  logo_image: '',
  manage_password: '',

  download: {
    windows: '',
    mac: '',
  },

  contact: {
    name: '',
    phone: '',
    email: '',
    address: '',
    prefix: '',
  },

  social: {
    facebook: '',
    messenger: '',
    zalo: '',
    telegram: '',
    tiktok: ''
  }
})

const menu = [
{
  label: 'Cơ bản',
  slot: 'basic'
},
{
  label: 'Liên hệ',
  slot: 'contact'
},
{
  label: 'Mạng xã hội',
  slot: 'social'
},
{
  label: 'Mật khẩu ủy quyền',
  slot: 'other'
},
]

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

const action = async (type) => {
  try {
    if(!!updating.value) return error('Có 1 tiến trình đang xử lý, vui lòng đợi')
    
    updating.value = true
    await useAPI('config/manage/action', {
      type: type,
      manage_password: state.value.manage_password
    })

    updating.value = false
  }
  catch (e) {
    updating.value = false
  }
}

getConfig()
</script>