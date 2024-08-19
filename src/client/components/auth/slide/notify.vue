<template>
  <UiFlex type="col" items="start" class="w-full max-h-full overflow-hidden">
    <!-- Header -->
    <UiFlex justify="end" class="p-4 pb-2 w-full">
      <USelectMenu v-model="page.size" :options="[5,10,15,20]" class="mr-1"/>

      <UDropdown :items="menuList">
        <UButton color="gray" icon="i-bx-dots-horizontal-rounded" :loading="deleting"/>
      </UDropdown>
    </UiFlex>

    <!-- Body -->
    <div class="px-4 grow overflow-y-auto w-full max-h-full">
      <LoadingUserNotifies v-if="loading" />

      <div v-else>
        <DataNotifyList :source="list" @to="emit('close')" />
      </div>
    </div>

    <!-- Footer -->
    <UiFlex justify="end" class="p-4 w-full">
      <UPagination :max="5" :page-count="page.size" :total="page.total" v-model="page.current" />
    </UiFlex>
  </UiFlex>
</template>

<script setup>
// Main
const emit = defineEmits(['close'])
const loading = ref(true)
const deleting = ref(false)
const list = ref(undefined)
const type = ref(undefined)
const page = ref({
  size: 5,
  current: 1,
  total: 0,
  sort: {
    by: 'createdAt',
    index: -1
  }
})

// Menu 
const menuList = [[
  { label: 'Mới nhất', icon: 'i-bx-down-arrow-alt', click: () => page.value.sort.index = -1 },
  { label: 'Cũ nhất', icon: 'i-bx-up-arrow-alt', click: () => page.value.sort.index = 1 }
], [
  { label: 'Xóa tất cả', icon: 'i-bx-trash', click: () => delAll() }
]]

// Watch 
watch(type, () => getList())
watch(
  () => page.value.size,
  () => getList()
)
watch(
  () => page.value.current,
  () => getList()
)
watch(
  () => page.value.sort.index,
  () => getList()
)

// Fetch List
const getList = async () => {
  try {
    loading.value = true
    const { list: listResult, page: pageResult } = await useAPI('notify/public/list', {
      type: type.value,
      page: JSON.parse(JSON.stringify(page.value))
    })

    page.value.total = pageResult.total
    list.value = listResult
    loading.value = false
  }
  catch (e) {
    loading.value = false
  }
}

// Fetch Del
const delAll = async () => {
  try {
    if(deleting.value == true) return
    deleting.value = true

    await useAPI('notify/del')
    deleting.value = false

    if(page.value.current == 1) return getList()
    page.value.current = 1
  }
  catch (e) {
    deleting.value = false
  }
}

getList()
</script>