<template>
  <UiContent title="Terms" sub="Điều khoản dịch vụ" class="w-full max-w-[700px] mx-auto">
    <UiFlex wrap justify="start" class="gap-1 mb-4">
      <UButton color="gray" @click="navigateTo('/about')" class="grow">Giới thiệu</UButton>
      <UButton color="gray" @click="navigateTo('/privacy')" class="grow">Quyền riêng tư</UButton>
      <UButton color="gray" disabled @click="navigateTo('/terms')" class="grow">Điều khoản dịch vụ</UButton>
    </UiFlex>

    <DataEmpty v-if="!!loading || !terms || terms == '<p></p>'" :text="!!loading ? 'Đang tải...' : 'Không có dữ liệu'"></DataEmpty>
    <UiEditorContent :content="terms" v-else />
  </UiContent>
</template>

<script setup>
const configStore = useConfigStore()
useSeoMeta({
  title: () => `Điều Khoản Dịch Vụ - ${configStore.config.name}`,
})

const loading = ref(true)
const terms = ref(undefined)

const get = async () => {
  try {
    loading.value = true
    const get = await useAPI('config/public/article/get', { type: 'terms' })

    terms.value = get
    loading.value = false
  }
  catch (e) {
    loading.value = false
  }
}

get()
</script>