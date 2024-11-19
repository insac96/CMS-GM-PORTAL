<template>
  <div>
    <UiFlex justify="between" class="mb-4">
      <UiText class="UT font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-3xl text-xl">
        Game <span class="text-primary">Tool</span> Mới Nhất
      </UiText>

      <UButton size="xs" color="gray" @click="navigateTo('/game/tool')">Xem Thêm</UButton>
    </UiFlex>

    <DataGameList :loading="loading" :list="list" os="tool" :max="page.size"/>

    <!-- Pagination -->
    <UiFlex justify="center" class="mt-3">
      <UPagination v-model="page.current" :page-count="page.size" :total="page.total" :max="4" size="xs" :disabled="!!loading"/>
    </UiFlex>
  </div>
</template>

<script setup>
const list = ref([])
const loading = ref(true)
const page = ref({
  size: 6,
  current: 1,
  total: 0
})
watch(() => page.value.size, () => getList())
watch(() => page.value.current, () => getList())

const getList = async () => {
  try {
    loading.value = true
    const data = await useAPI('game/tool/public/list/latest', JSON.parse(JSON.stringify(page.value)))

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