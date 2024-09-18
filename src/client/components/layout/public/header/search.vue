<template>
  <UiFlex>
    <UInput icon="i-bx-search" size="md" placeholder="Tìm kiếm" readonly class="hidden lg:inline-block" @click="modal = true" />
    <UButton color="gray" icon="i-bx-search" square class="lg:hidden" @click="modal = true" />

    <UModal v-model="modal" :ui="{ width: 'lg:max-w-2xl md:max-w-2xl sm:max-w-2xl' }">
      <div class="p-4">
        <SelectGameOs v-model="page.os" class="mb-1"/>
        <UInput icon="i-bx-search" size="sm" v-model="page.search" placeholder="Bạn muốn tìm trò chơi gì?" class="w-full mb-2" :loading="loading" />

        <DataEmpty :text="textInfo" v-if="list.length == 0" />

        <div v-else>
          <DataGameListMini :list="list" :os="page.os" @to="modal = false" />

          <!-- Pagination -->
          <UiFlex justify="end">
            <UPagination v-model="page.current" :page-count="page.size" :total="page.total" :max="4" size="2xs"/>
          </UiFlex>
        </div>
      </div>
    </UModal>
  </UiFlex>
</template>

<script setup>
const modal = ref(false)
const loading = ref(false)
const list = ref([])

const page = ref({
  size: 5,
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
const delayTimer = ref(undefined)

const textInfo = computed(() => {
  if(!page.value.search) return 'Nhập từ khóa để bắt đầu tìm kiếm'
  if(!!page.value.search){
    if(!loading.value) return 'Không có dữ liệu'
    else return 'Đang tìm kiếm...'
  }
})

watch(() => page.value.search, () => {
  if (delayTimer.value) clearTimeout(delayTimer.value)
  loading.value = true
  delayTimer.value = setTimeout(() => searchItem(), 1000)
})
watch(() => page.value.current, () => searchItem())

const searchItem = async () => {
  try {
    if(!page.value.search) throw true
    const data = await useAPI('game/public/search', JSON.parse(JSON.stringify(page.value)))

    list.value = data.list
    page.value.total = data.total
    loading.value = false
  }
  catch(e){
    loading.value = false
    page.value.total = 0
    list.value = []
  }
}
</script>