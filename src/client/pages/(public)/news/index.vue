<template>
  <UiContent title="Tin tức" sub="Tổng hợp tất cả tin tức">
    <UiFlex class="mb-4 gap-1 flex-col sm:flex-row">
      <UForm :state="page" @submit="page.current = 1, getList()" class="w-full sm:w-auto">
        <UInput v-model="page.search" placeholder="Tìm kiếm..." icon="i-bx-search" size="sm" />
      </UForm>

      <SelectNewsCategory v-model="page.category" multiple size="sm" class="w-full sm:w-auto" />
    </UiFlex>

    <DataNewsList :list="list" />
  </UiContent>
</template>

<script setup>
const list = ref([])
const loading = ref(false)

// Page
const page = ref({
  size: 6,
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