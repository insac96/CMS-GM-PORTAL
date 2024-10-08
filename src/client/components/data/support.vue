<template>
  <div>
    <UButton :loading="loading" block @click="get">Liên Hệ Hỗ Trợ</UButton>

    <UModal v-model="modal">
      <UiContent title="Liên Hệ Hỗ Trợ" sub="Bạn có thể liên hệ với chúng tôi qua các hình thức sau" class="p-4" no-dot>
        <template #more>
          <UButton icon="i-bx-x" class="ml-auto" size="2xs" color="gray" square @click="modal = false"></UButton>
        </template>

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

        <UiFlex justify="center" class="gap-2 mt-4" wrap>
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
      </UiContent>
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
  telegram: null,
  tiktok: null,
})

const open = (url) => {
  if(!url) return useNotify().error('Chúng tôi đang cập nhật thông tin, vui lòng quay lại sau')
  useTo().openNewTab(url)
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