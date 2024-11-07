<template>
  <UiContent title="Giới Thiệu" sub="Thông tin tổng quan về chúng tôi" class="w-full max-w-[700px] mx-auto">
    <UiFlex wrap justify="start" class="gap-1 mb-4">
      <UButton color="gray" disabled @click="navigateTo('/about')" class="grow">Giới thiệu</UButton>
      <UButton color="gray" @click="navigateTo('/privacy')" class="grow">Quyền riêng tư</UButton>
      <UButton color="gray" @click="navigateTo('/terms')" class="grow">Điều khoản dịch vụ</UButton>
    </UiFlex>

    <DataEmpty v-if="!!loading || !about" :loading="loading"></DataEmpty>
    <UiEditorContent :content="about" v-else />
  </UiContent>
</template>

<script setup>
const configStore = useConfigStore()
useSeoMeta({
  title: () => `Giới Thiệu - ${configStore.config.name}`,
})

const loading = ref(true)
const about = ref(undefined)

const get = async () => {
  try {
    loading.value = true
    const get = await useAPI('config/public/article/get', { type: 'about' })

    about.value = get
    loading.value = false
  }
  catch (e) {
    loading.value = false
  }
}

get()
</script>