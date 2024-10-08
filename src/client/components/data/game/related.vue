<template>
  <UCard :ui="{ body: { padding: 'px-4 sm:px-4 pb-1 sm:pb-1 pt-4 sm:pt-4' }}">
    <UiContent title="Đề Xuất" sub="Các trò chơi liên quan" no-dot class="GameRelated">
      <DataEmpty text="Không có dữ liệu" :loading="loading" v-if="!!loading || list.length == 0" />
      <DataGameListMini :list="list" :os="os" :no-icon="true" />
    </UiContent>
  </UCard>
</template>

<script setup>
const props = defineProps(['os', 'platform', 'category', 'skip'])
const list = ref([])
const loading = ref(true)
const page = ref({
  size: 5,
  current: 1,
  sort: {
    column: 'statistic.play',
    direction: 'desc'
  },
  platform: props.platform || [],
  category: props.category || [],
  total: 0,
  skip: props.skip
})

const getList = async () => {
  try {
    loading.value = true
    const data = await useAPI(`game/${props.os}/public/list/main`, JSON.parse(JSON.stringify(page.value)))

    loading.value = false
    list.value = data.list
    page.value.total = data.total
  }
  catch (e) {
    loading.value = false
  } 
}

onMounted(() => setTimeout(getList, 1))
</script>

<style lang="sass">
.GameRelated
  .UiContentHeader
    margin-bottom: 0 !important
</style>