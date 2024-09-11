<template>
  <UiContent title="Game Tool" sub="Trò chơi kèm bộ công cụ GM">
    <UiFlex class="mb-4 gap-1 flex-col sm:flex-row">
      <UForm :state="page" @submit="page.current = 1, getList()" class="w-full sm:w-auto">
        <UInput v-model="page.search" placeholder="Tìm kiếm..." icon="i-bx-search" size="sm" />
      </UForm>

      <SelectGamePlatform v-model="page.platform" multiple size="sm" class="w-full sm:w-auto" />
      <SelectGameCategory v-model="page.category" multiple size="sm" class="w-full sm:w-auto" />
    </UiFlex>

    <DataGameList :list="list" />
  </UiContent>
</template>

<script setup>
const list = ref([])
const loading = ref(false)

// Page
const page = ref({
  size: 6,
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
    const data = await useAPI('game/tool/public/project/list/main', JSON.parse(JSON.stringify(page.value)))

    loading.value = false
    list.value = data.list
    page.value.total = data.total
  }
  catch (e) {
    loading.value = false
  } 
}

getList()
</script>