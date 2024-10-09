<template>
  <UCard :ui="{ body: { padding: 'p-4 sm:p-4' }}">
    <UiContent title="Bình Luận" sub="Các bình luận về trò chơi" no-dot class="GameComment">
      <DataEmpty text="Không có dữ liệu" :loading="loading.list" v-if="!!loading.list || list.length == 0" />

      <UiFlex type="col" class="mt-4 gap-4" v-else>
        <UiFlex v-for="(item, index) in list" :key="index" class="w-full gap-3 ">
          <UAvatar :src="item.user.user.avatar"></UAvatar>

          <div>
            <UiText size="sm" weight="semibold" class="capitalize" color="primary">{{ item.user.user.username }}</UiText>
            <UiText size="sm">{{ item.content }}</UiText>
          </div>
        </UiFlex>
      </UiFlex>

      <UiFlex justify="center" class="mt-4" v-if="page.total > page.size">
        <UPagination v-model="page.current" :page-count="page.size" :total="page.total" :max="4" size="2xs" />
      </UiFlex>
       
      <UForm :state="state" class="mt-4" @submit="submit" v-if="!!authStore.isLogin">
        <UInput v-model="state.content" size="sm" class="grow" placeholder="Để lại bình luận của bạn...">
        </UInput>
      </UForm>
    </UiContent>
  </UCard>
</template>

<script setup>
const authStore = useAuthStore()
const props = defineProps(['game', 'os'])
const list = ref([])
const loading = ref({
  list: true,
  create: false
})
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
watch(() => page.value.current, () => getList())

const state = ref({
  content: null,
  game: props.game?.code
})

const submit = async () => {
  try {
    if(state.value.content < 5) return useNotify().error('Bình luận ít nhất 5 ký tự')
    if(state.value.content > 50) return useNotify().error('Bình luận nhiều nhất 5 ký tự')

    loading.value.create = true
    const data = await useAPI(`game/${props.os}/public/comment/create`, JSON.parse(JSON.stringify(state.value)))

    page.value.total = data.total
    loading.value.create = false

    state.value.content = null
    page.value.current = 1

    getList()
  }
  catch (e) {
    loading.value.create = false
  } 
}

const getList = async () => {
  try {
    loading.value.list = true
    const data = await useAPI(`game/${props.os}/public/comment/list`, JSON.parse(JSON.stringify(page.value)))

    list.value = data.list
    page.value.total = data.total
    loading.value.list = false
  }
  catch (e) {
    loading.value.list = false
  } 
}

onMounted(() => setTimeout(getList, 1))
</script>

<style lang="sass">
.GameComment
  .UiContentHeader
    margin-bottom: 0 !important
</style>