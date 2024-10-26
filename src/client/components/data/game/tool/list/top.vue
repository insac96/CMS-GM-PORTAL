<template>
  <div>
    <DataEmpty :loading="loading" class="min-h-[300px]" v-if="!!loading || list.length == 0" />
    <DataGameListMini :list="list" os="tool" :play="true" v-else />
  </div>
</template>

<script setup>
const props = defineProps(['sort'])
const list = ref([])
const loading = ref(true)
const page = ref({
  size: 9,
  current: 1,
  sort: {
    column: props.sort,
    direction: 'desc'
  },
  total: 0
})

const getList = async () => {
  try {
    loading.value = true
    const data = await useAPI('game/tool/public/list/top', JSON.parse(JSON.stringify(page.value)))

    list.value = data
    setTimeout(() => loading.value = false, 700)
  }
  catch (e) {
    loading.value = false
  } 
}

onMounted(() => setTimeout(getList, 1))
</script>