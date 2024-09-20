<template>
  <UiContent title="Game China" sub="Trò chơi trung quốc hay">
    <UiFlex class="mb-4 gap-1 flex-col sm:flex-row">
      <UForm :state="page" @submit="page.current = 1, getList()" class="w-full sm:w-auto">
        <UInput v-model="page.search" placeholder="Tìm kiếm..." icon="i-bx-search" size="sm" />
      </UForm>

      <SelectGamePlatform v-model="page.platform" multiple size="sm" class="w-full sm:w-auto" />
      <SelectGameCategory v-model="page.category" multiple size="sm" class="w-full sm:w-auto" />
    </UiFlex>

    <DataGameList :loading="loading" :list="list" os="china" />

    <!-- Pagination -->
    <UiFlex justify="end" class="mt-4" v-if="page.total > page.size">
      <UPagination v-model="page.current" :page-count="page.size" :total="page.total" :max="4" size="xs"/>
    </UiFlex>
  </UiContent>
</template>

<script setup>
const configStore = useConfigStore()
useSeoMeta({
  title: () => `Game China - ${configStore.config.name}`,
  ogTitle: () => `Game China - ${configStore.config.name}`,
  description: () => 'Tổng hợp các trò chơi trung quốc hay, hấp dẫn',
  ogDescription: () => 'Tổng hợp các trò chơi trung quốc hay, hấp dẫn',
})

const list = ref([])
const loading = ref(false)

// Page
const page = ref({
  size: 12,
  current: 1,
  sort: {
    column: 'statistic.play',
    direction: 'desc'
  },
  search: null,
  platform: [],
  category: [],
  total: 0
})
watch(() => page.value.size, () => getList())
watch(() => page.value.current, () => getList())
watch(() => page.value.sort.column, () => getList())
watch(() => page.value.sort.direction, () => getList())
watch(() => page.value.platform, () => getList())
watch(() => page.value.category, () => getList())
watch(() => page.value.search, (val) => !val && getList())

const getList = async () => {
  try {
    loading.value = true
    const data = await useAPI('game/china/public/list/main', JSON.parse(JSON.stringify(page.value)))

    list.value = data.list
    page.value.total = data.total
    loading.value = false
  }
  catch (e) {
    loading.value = false
  } 
}

getList()
</script>