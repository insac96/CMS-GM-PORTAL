<template>
  <UiContent title="Game Manage" sub="Danh sách game đang quản lý" no-dot>
    <template #more>
      <UButton icon="i-bx-x" class="ml-auto" size="2xs" color="gray" square @click="emits('close')"></UButton>
    </template>

    <SelectGameOs v-model="page.os" class="mb-1"/>

    <UiFlex class="mb-4 gap-1 flex-col sm:flex-row">
      <UForm :state="page" @submit="page.current = 1, getList()" class="w-full sm:w-auto grow">
        <UInput v-model="page.search" placeholder="Tìm kiếm..." icon="i-bx-search" size="sm" />
      </UForm>

      <SelectGamePlatform v-model="page.platform" multiple size="sm" class="w-full sm:w-auto grow" />
      <SelectGameCategory v-model="page.category" multiple size="sm" class="w-full sm:w-auto grow" />
    </UiFlex>

    <DataGameList :loading="loading" :list="list" :os="page.os" :gm="true" @click="emits('to')"/>

    <!-- Pagination -->
    <UiFlex justify="end" class="mt-4" v-if="page.total > page.size">
      <UPagination v-model="page.current" :page-count="page.size" :total="page.total" :max="4" size="xs"/>
    </UiFlex>
  </UiContent>
</template>

<script setup>
const emits = defineEmits(['to', 'close'])
const list = ref([])
const loading = ref(false)

const page = ref({
  size: 12,
  current: 1,
  sort: {
    column: 'statistic.play',
    direction: 'desc'
  },
  platform: [],
  category: [],
  total: 0,
  search: null,
  os: 'tool'
})
watch(() => page.value.size, () => getList())
watch(() => page.value.current, () => getList())
watch(() => page.value.sort.column, () => getList())
watch(() => page.value.sort.direction, () => getList())
watch(() => page.value.platform, () => getList())
watch(() => page.value.category, () => getList())
watch(() => page.value.os, () => getList())
watch(() => page.value.search, (val) => !val && getList())

const getList = async () => {
  try {
    loading.value = true
    const data = await useAPI('game/gm/list', JSON.parse(JSON.stringify(page.value)))

    list.value = data.list
    page.value.total = data.total
    loading.value = false
  }
  catch (e) {
    loading.value = false
  } 
}

onMounted(() => setTimeout(getList, 1))
</script>