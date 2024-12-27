<template>
  <UiContent title="Notification" sub="Thông báo nền tảng">
    <DataEmpty v-if="!!loading.list || list.length == 0" text="Không có thông báo" :loading="loading.list" class="min-h-[300px]" />
    <UiFlex v-else class="gap-2" type="col" >
      <UAlert 
        :title="item.title" 
        :icon="!!item.pin ? 'i-bxs-pin' : 'i-bx-bell'" 
        class="cursor-pointer" 
        v-for="(item, index) in list" :key="index" 
        @click="view(item._id)"
        :color="!!item.pin ? 'primary' : 'white'"
        :variant="!!item.pin ? 'soft' : 'solid'"
      >
        <template #description>
          <UiText color="gray" size="xs">{{ useDayJs().fromTime(item.createdAt) }}</UiText>
        </template>
      </UAlert>
    </UiFlex>

    <UiFlex justify="center" class="mt-4">
      <UPagination v-model="page.current" :page-count="page.size" :total="page.total" />
    </UiFlex>

    <UModal v-model="modal" :ui="{ width: 'sm:max-w-[700px]' }">
      <div class="p-4">
        <DataEmpty v-if="!!loading.view || !notify" text="Không có thông tin" :loading="loading.view" class="min-h-[300px]"  />

        <UiContent 
          :title="notify.title" 
          :sub="useDayJs().fromTime(notify.createdAt)"
          no-dot 
          v-else
        >
          <template #left>
            <UAvatar :icon="!!notify.pin ? 'i-bxs-pin' : 'i-bx-bell'" size="lg" class="mr-4"></UAvatar>
          </template>

          <template #more>
            <UButton icon="i-bx-x" class="ml-auto" size="2xs" color="gray" square @click="modal = false"></UButton>
          </template>

          <UiEditorContent :content="notify.content" />
        </UiContent>
      </div>
    </UModal>
  </UiContent>
</template>

<script setup>
const route = useRoute()
const list = ref([])
const loading = ref({
  list: true,
  view: false
})
const modal = ref(false)
const notify = ref(null)
const page = ref({
  size: 10,
  current: 1,
  sort: {
    column: 'createdAt',
    direction: 'desc'
  },
  total: 0,
  collab: route.params._code
})
watch(() => page.value.size, () => getList())
watch(() => page.value.current, () => getList())

const view = async (_id) => {
  try {
    loading.value.view = true
    modal.value = true

    const data = await useAPI('collab/manage/code/notify/view', {
      _id: _id,
      collab: route.params._code
    })

    notify.value = data
    setTimeout(() => loading.value.view = false, 500)
  }
  catch(e){
    loading.value.view = false
    notify.value = null
  }
}

const getList = async () => {
  try {
    loading.value.list = true
    const data = await useAPI('collab/manage/code/notify/list', JSON.parse(JSON.stringify(page.value)))

    list.value = data.list
    page.value.total = data.total

    setTimeout(() => loading.value.list = false, 500)
  }
  catch(e){
    loading.value.list = false
  }
}

getList()
</script>