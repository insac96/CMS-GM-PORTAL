<template>
  <div v-if="list.length > 0">
    <UCard :ui="{ 
      body: { padding: 'p-0 sm:p-0' },
    }">
      <LoadingTable v-if="loading.load" />

      <UTable v-model:sort="page.sort" :columns="columns" :rows="list" :ui="{
        th: { padding: 'py-2' },
        td: { padding: 'py-2' },
      }">
        <template #code-data="{ row }">
          <UiFlex class="cursor-pointer gap-2 select-none" @click="startCopy(row.code)">
            <UiText weight="semibold">{{ row.code }}</UiText>
            <!-- <UiIcon name="i-bx-copy" color="primary"></UiIcon> -->
          </UiFlex>
        </template>

        <template #gift-data="{ row }">
          <DataGamePrivateItemList :items="row.gift" :size="45" :game="game.code" />
        </template>
      </UTable>
    </UCard>
  </div>
</template>

<script setup>
import { useClipboard } from '@vueuse/core'
const { copy, isSupported } = useClipboard()
const props = defineProps(['game'])

const loading = ref({
  load: true
})

const list = ref([])

const columns = [
  {
    key: 'code',
    label: 'Giftcode',
  },{
    key: 'gift',
    label: 'Phần quà',
  }
]

const page = ref({
  size: 10,
  current: 1,
  sort: {
    column: 'createdAt',
    direction: 'desc'
  },
  total: 0,
  game: props.game.code
})
watch(() => page.value.size, () => getList())
watch(() => page.value.current, () => getList())
watch(() => page.value.sort.column, () => getList())
watch(() => page.value.sort.direction, () => getList())

const startCopy = (text) => {
  if(!isSupported.value || !text) return
  copy(text)
  useNotify().success('Sao chép vào bộ nhớ tạm thành công')
}

const getList = async () => {
  try {
    loading.value.load = true
    const data = await useAPI('game/private/public/giftcode/public', JSON.parse(JSON.stringify(page.value)))

    loading.value.load = false
    list.value = data.list
    page.value.total = data.total
  }
  catch (e) {
    loading.value.load = false
  } 
}

onMounted(() => setTimeout(getList, 1))
</script>