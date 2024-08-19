<template>
  <div>
    <UButton color="gray" size="md" :loading="loading" block @click="get">Liên Hệ Hỗ Trợ</UButton>

    <UModal v-model="modal">
      <UCard>
          <UiFlex class="mb-6">
            <UiIcon name="i-bxs-business" color="primary" class="mr-2" />
            <UiText size="sm" color="gray" weight="semibold" class="mr-auto" mini>Tổ chức</UiText>
            <UiText size="sm" weight="semibold" align="right" class="ml-6">{{ contact.name || '...' }}</UiText>
          </UiFlex>
          <UiFlex class="mb-6">
            <UiIcon name="i-bxs-map" color="primary" class="mr-2" />
            <UiText size="sm" color="gray" weight="semibold" class="mr-auto" mini>Địa chỉ</UiText>
            <UiText size="sm" weight="semibold" align="right" class="ml-6">{{ contact.address || '...' }}</UiText>
          </UiFlex>
          <UiFlex class="mb-6">
            <UiIcon name="i-bxs-phone" color="primary" class="mr-2" />
            <UiText size="sm" color="gray" weight="semibold" class="mr-auto" mini>Điện thoại</UiText>
            <UiText size="sm" weight="semibold" align="right" class="ml-6">{{ contact.phone || '...' }}</UiText>
          </UiFlex>
          <UiFlex>
            <UiIcon name="i-bxs-envelope" color="primary" class="mr-2" />
            <UiText size="sm" color="gray" weight="semibold" class="mr-auto" mini>Hòm thư</UiText>
            <UiText size="sm" weight="semibold" align="right" class="ml-6">{{ contact.email || '...' }}</UiText>
          </UiFlex>

          <template #footer>
            <UiFlex justify="center" class="gap-2" wrap>
              <UiImg 
                v-for="(value, key) in social" :key="key"
                class="max-w-[45px] max-h-[45px] cursor-pointer rounded-full"
                :src="`/images/social/${key}.png`"
                w="1" h="1"
                imgW="90" imgH="90"
                :alt="key"
                @click="open(value)"
              ></UiImg>
            </UiFlex>
          </template>
        </UCard>
    </UModal>
  </div>
</template>

<script setup>
const loading = ref(false)

const modal = ref(false)

const contact = ref({
  name: null,
  phone: null,
  email: null,
  address: null
})

const social = ref({
  facebook: null,
  messenger: null,
  zalo: null,
  // telegram: null,
  // tiktok: null,
  // youtube: null,
})

const open = (url) => {
  const toast = useToast()

  if(!url) return toast.add({
    title: 'Thông báo',
    description: 'Chúng tôi đang cập nhật thông tin, vui lòng quay lại sau',
    color: 'red',
    icon: 'i-bxs-error',
    timeout: 2000
  })

  window.open(url, '_blank')
}

const get = async () => {
  try {
    loading.value = true
    const data = await useAPI('config/public/contact')

    contact.value = Object.assign(contact.value, data.contact)
    social.value = Object.assign(social.value, data.social)
    loading.value = false
    modal.value = true
  }
  catch (e) {
    loading.value = false
  }
}
</script>