<template>
  <UiContent title="News" sub="Tổng hợp tất cả tin tức">
    <UiFlex justify="between" class="mb-4">
      <UForm @submit="getList" class="mr-2 max-w-[150px] sm:max-w-[220px]">
        <UInput v-model="page.search" placeholder="Tìm kiếm..." icon="i-bx-search" size="sm" />
      </UForm>
      
      <SelectNewsCategory v-model="page.category" :options="[{ _id: undefined, label: 'Tất cả' }]" size="sm" />
    </UiFlex>

    <div class="grid grid-cols-12 gap-4" v-if="!!loading">
      <LoadingNewsBox v-for="i in [1,2]" :key="i" class="md:col-span-6 col-span-12" />
    </div>

    <div v-else>
      <DataEmpty icon="i-bx-news" text="Không có tin tức" v-if="list.length == 0"></DataEmpty>

      <div class="grid grid-cols-12 gap-4" v-if="list.length > 0">
        <DataNewsBox 
          v-for="(item, index) in list" 
          :key="index" 
          class="md:col-span-4 sm:col-span-6 col-span-12"
          :news="item"
        ></DataNewsBox>
      </div>
    </div>

    <UiFlex justify="end" class="mt-6" v-if="page.total > list.length">
      <UPagination :max="5" :page-count="page.size" :total="page.total" v-model="page.current" />
    </UiFlex>
  </UiContent>
</template>

<script setup>
const configStore = useConfigStore()
useSeoMeta({
  title: () => `Tin tức - ${configStore.config.name}`,
})

const list = ref([])
const loading = ref(true)

const page = ref({
  size: 6,
  current: 1,
  total: 0,
  category: undefined,
  search: undefined
})
watch(() => page.value.size, () => getList())
watch(() => page.value.current, () => getList())
watch(() => page.value.category, () => getList())
watch(() => page.value.search, (val) => (!val && getList()))

const getList = async () => {
  try {
    loading.value = true
    const data = await useAPI('news/list', JSON.parse(JSON.stringify(page.value)))

    loading.value = false
    page.value.total = data.total
    list.value = data.list
  }
  catch (e) {
    loading.value = false
    list.value = []
  }
}

getList()
</script>