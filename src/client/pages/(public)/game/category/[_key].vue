<template>
  <UiContent :title="category.name" sub="Trò chơi theo thể loại">
    <SelectGameOs class="block sm:inline-block mb-1" v-model="page.os" :disabled="!!loading"/>

    <UiFlex class="mb-4 gap-1 flex-col sm:flex-row">
      <UForm :state="page" @submit="page.current = 1, getList()" class="w-full sm:w-auto">
        <UInput v-model="page.search" placeholder="Tìm kiếm..." icon="i-bx-search" size="sm" :disabled="!!loading"/>
      </UForm>

      <SelectGamePlatform v-model="page.platform" multiple size="sm" class="w-full sm:w-auto" :disabled="!!loading" />
    </UiFlex>

    <DataGameList :loading="loading" :list="list" :os="page.os" />

    <!-- Pagination -->
    <UiFlex justify="center" class="mt-4" v-if="page.total > page.size">
      <UPagination v-model="page.current" :page-count="page.size" :total="page.total" :max="4" size="xs" :disabled="!!loading"/>
    </UiFlex>
  </UiContent>
</template>

<script setup>
const configStore = useConfigStore()
const route = useRoute()
const category = ref({
  name: 'Đang tải...'
})
const list = ref([])
const loading = ref(true)

useSeoMeta({
  title: () => `${category.value.name} - ${configStore.config.name}`,
  ogTitle: () => `${category.value.name} - ${configStore.config.name}`,
  description: () => `Tổng hợp các trò chơi thuộc thể loại ${category.value.name}`,
  ogDescription: () => `Tổng hợp các trò chơi thuộc thể loại ${category.value.name}`,
})

// Page
const page = ref({
  size: 12,
  current: 1,
  sort: {
    column: 'statistic.play',
    direction: 'desc'
  },
  search: null,
  os: route.query.os || 'tool',
  platform: [],
  category: route.params._key,
  total: 0
})
watch(() => page.value.size, () => getList())
watch(() => page.value.current, () => getList())
watch(() => page.value.sort.column, () => getList())
watch(() => page.value.sort.direction, () => getList())
watch(() => page.value.os, (val) => {
  navigateTo({ path: route.fullPath, query: { os: val }})
  getList()
})
watch(() => page.value.platform, () => getList())
watch(() => page.value.search, (val) => !val && getList())

const getList = async () => {
  try {
    loading.value = true
    const data = await useAPI('game/public/category/list', JSON.parse(JSON.stringify(page.value)))

    category.value = data.category
    list.value = data.list
    page.value.total = data.total

    setTimeout(() => loading.value = false, 700)
  }
  catch (e) {
    loading.value = false
  } 
}

getList()
</script>