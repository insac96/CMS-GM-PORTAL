<template>
  <UCard :ui="{ body: { padding: 'px-4 sm:px-4 pb-1 sm:pb-1 pt-4 sm:pt-4' }}">
    <UiContent title="Bình Luận" sub="Các bình luận về trò chơi" no-dot class="GameComment">
      <DataEmpty text="Không có dữ liệu" :loading="loading" v-if="!!loading || list.length == 0" />
      

    </UiContent>
  </UCard>
</template>

<script setup>
const props = defineProps(['game'])
const list = ref([])
const loading = ref(true)
const page = ref({
  size: 5,
  current: 1,
  sort: {
    column: 'createdAt',
    direction: 'desc'
  },
  total: 0,
  game: props.game?.code
})

const getList = async () => {
  try {
    loading.value = true
    const data = await useAPI(`game/${props.os}/public/comment/list`, JSON.parse(JSON.stringify(page.value)))

    loading.value = false
    list.value = data.list
    page.value.total = data.total
  }
  catch (e) {
    loading.value = false
  } 
}

// onMounted(() => setTimeout(getList, 1))
</script>

<style lang="sass">
.GameComment
  .UiContentHeader
    margin-bottom: 0 !important
</style>