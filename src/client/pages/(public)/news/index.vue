<template>
  <UiContent title="Tin Tức" sub="Tổng hợp tất cả tin tức">
    <UiFlex class="mb-4 gap-1 flex-col sm:flex-row">
      <UForm :state="page" @submit="page.current = 1, getList()" class="w-full sm:w-auto">
        <UInput v-model="page.search" placeholder="Tìm kiếm..." icon="i-bx-search" size="sm" :disabled="!!loading"/>
      </UForm>

      <SelectNewsCategory v-model="page.category" multiple size="sm" class="w-full sm:w-auto" :disabled="!!loading" />
    </UiFlex>

    <DataNewsList :list="list" :loading="loading" />

    <!-- Pagination -->
    <UiFlex justify="center" class="mt-4">
      <UPagination v-model="page.current" :page-count="page.size" :total="page.total" :max="4" size="xs" :disabled="!!loading"/>
    </UiFlex>
  </UiContent>
</template>

<script setup>
const configStore = useConfigStore()
useSeoMeta({
  title: () => `Tin Tức - ${configStore.config.name}`,
  ogTitle: () => `Tin Tức - ${configStore.config.name}`,
  description: () => 'Tổng hợp các tin tức mới nhất về trò chơi và các thông tin khuyến mãi',
  ogDescription: () => 'Tổng hợp các tin tức mới nhất về trò chơi và các thông tin khuyến mãi',
})

const list = ref([])
const loading = ref(true)

// Page
const page = ref({
  size: 12,
  current: 1,
  search: null,
  category: [],
  total: 0
})
watch(() => page.value.size, () => getList())
watch(() => page.value.current, () => getList())
watch(() => page.value.category, () => getList())
watch(() => page.value.search, (val) => !val && getList())

const getList = async () => {
  try {
    loading.value = true
    const data = await useAPI('news/public/list/main', JSON.parse(JSON.stringify(page.value)))

    list.value = data.list
    page.value.total = data.total

    setTimeout(() => loading.value = false, 700)
  }
  catch (e) {
    return false
  } 
}

getList()
</script>