<template>
  <UiContent title="Privacy" sub="Chính sách quyền riêng tư" class="w-full max-w-[700px] mx-auto">
    <UiFlex wrap justify="start" class="gap-1 mb-4">
      <UButton color="gray" @click="navigateTo('/about')" class="grow">Giới thiệu</UButton>
      <UButton color="gray" disabled @click="navigateTo('/privacy')" class="grow">Quyền riêng tư</UButton>
      <UButton color="gray" @click="navigateTo('/terms')" class="grow">Điều khoản dịch vụ</UButton>
    </UiFlex>

    <DataEmpty v-if="!!loading || !privacy || privacy == '<p></p>'" :text="!!loading ? 'Đang tải...' : 'Không có dữ liệu'"></DataEmpty>
    <UiEditorContent :content="privacy" v-else />
  </UiContent>
</template>

<script setup>
const configStore = useConfigStore()
useSeoMeta({
  title: () => `Quyền Riêng Tư - ${configStore.config.name}`,
})

const loading = ref(true)
const privacy = ref(undefined)

const get = async () => {
  try {
    loading.value = true
    const get = await useAPI('config/public/article/get', { type: 'privacy' })

    privacy.value = get
    loading.value = false
  }
  catch (e) {
    loading.value = false
  }
}

get()
</script>