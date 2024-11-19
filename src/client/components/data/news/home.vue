<template>
  <div>
    <UiFlex justify="between" class="mb-4">
      <UiText class="UT font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-3xl text-xl">
        <span class="text-primary">Tin Tức</span> Mới Nhất
      </UiText>

      <UButton size="xs" color="gray" @click="navigateTo('/news')">Xem Thêm</UButton>
    </UiFlex>

    <UCard :ui="{ body: { padding: 'py-0 sm:py-0'}}">
      <DataEmpty class="min-h-[300px]" :loading="loading" v-if="!!loading || list.length == 0"></DataEmpty>
      <DataNewsListMini v-else :list="list" />
    </UCard>
  </div>
</template>

<script setup>
const list = ref([])
const loading = ref(true)
const page = ref({
  size: 5,
  current: 1,
  total: 0
})
watch(() => page.value.size, () => getList())
watch(() => page.value.current, () => getList())

const getList = async () => {
  try {
    loading.value = true
    const data = await useAPI('news/public/list/latest', JSON.parse(JSON.stringify(page.value)))

    list.value = data.list
    page.value.total = data.total
    setTimeout(() => loading.value = false, 500)
  }
  catch (e) {
    loading.value = false
  } 
}

onMounted(() => setTimeout(getList, 1))
</script>