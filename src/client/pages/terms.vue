<template>
  <UiContent title="Terms" sub="Điều khoản dịch vụ">
    <DataEmpty v-if="!!loading || !terms" :text="!!loading ? 'Đang tải...' : 'Không có dữ liệu'"></DataEmpty>

    <DataEditor :content="terms" v-else />
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
    const get = await useAPI('config/public/terms')

    terms.value = get
    loading.value = false
  }
  catch (e) {
    loading.value = false
  }
}

get()
</script>