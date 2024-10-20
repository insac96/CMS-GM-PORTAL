<template>
  <div v-if="post">
    <UBreadcrumb :links="breadcrumb" class="mb-2"/>

    <!--Info-->
    <UiContent :title="post.title" :sub="useDayJs().displayFull(post.update.last)" no-dot>
      <!--Avatar User-->
      <template #right>
        <DataUserAvatar :user="post.creater" v-if="!!post.creater" class="mr-4"/>
      </template>

      <!--Badge Info-->
      <UiFlex class="mt-2 mb-4 gap-1" wrap>
        <UBadge v-if="post.creater">
          <UIcon name="i-bx-user" class="mr-1" /> {{ post.creater.username }}
        </UBadge>

        <UBadge color="gray">
          <UIcon name="i-bx-show" class="mr-1" /> {{ post.statistic.view }}
        </UBadge>

        <UBadge color="gray">
          <UIcon name="i-bx-like" class="mr-1" /> {{ post.statistic.like }}
        </UBadge>

        <UBadge color="gray">
          <UIcon name="i-bx-chat" class="mr-1" /> {{ post.statistic.comment }}
        </UBadge>
      </UiFlex>

      <!--Content-->
      <DataEditor :content="post.content" class="mb-4" />
    </UiContent>

    <!--Comment-->
    <div>
      <!--Action-->
      <UiFlex class="gap-1 mb-4">
        <USelectMenu v-model="page.size" size="xs" :options="[5,10,20,50,100]" />

        <UButton 
          class="ml-auto" icon="i-bx-like" 
          size="xs" 
          :color="post.liked ? 'rose' : 'gray'" 
          :loading="loading.like" 
          @click="updateLike(post.liked ? false : true)"
        >{{ post.liked ? 'Bỏ thích' : 'Thích' }}</UButton>
        
        <UButton size="xs" icon="i-bx-chat" @click="modal.comment = true">Phản hồi</UButton>
      </UiFlex>

      <!--Content-->
      <div>
        <DataEmpty class="min-h-[300px]" :loading="loading.comment.list" text="Bài viết chưa có phản hồi" v-if="!!loading.comment.list || comments.length == 0"/>
        <DataForumPostCommentList :list="comments" v-else />
      </div>

      <UiFlex justify="between" class="mt-4">
        <UButton icon="i-bxs-arrow-to-top" color="gray" size="xs" @click="scrollTop">Top</UButton>
        <UPagination v-model="page.current" :page-count="page.size" :total="page.total" :max="4" size="xs" />
      </UiFlex>
    </div>

    <!--Create-->
    <UModal v-model="modal.comment" prevent-close :ui="{width: 'sm:max-w-[900px]'}">
      <UiContent title="Phản hồi bài viết" no-dot class="p-4">
        <template #more>
          <UButton icon="i-bx-x" class="ml-auto" size="2xs" color="gray" square @click="modal.comment = false"></UButton>
        </template>

        <UForm ref="form" :state="state" :validate="validate" @submit="createComment">
          <UFormGroup name="content">
            <UiEditor v-model="state.content"></UiEditor>
          </UFormGroup>

          <UiFlex justify="end" class="mt-4">
            <UButton type="submit" :loading="loading.comment.create">Xác Nhận</UButton>
            <UButton color="gray" @click="modal.comment = false" :disabled="loading.comment.create" class="ml-1">Đóng</UButton>
          </UiFlex>
        </UForm>
      </UiContent>
    </UModal>
  </div>
</template>

<script setup>
const authStore = useAuthStore()
const route = useRoute()
const post = ref(undefined)
const comments = ref([])
const loading = ref({
  page: true,
  like: false,
  comment: {
    list: true,
    create: false
  },
})
const modal = ref({
  comment: false
})
const page = ref({
  size: 5,
  current: 1,
  sort: {
    column: 'createdAt',
    direction: 'asc'
  },
  total: 0,
  post: null
})
watch(() => page.value.size, () => getComments())
watch(() => page.value.current, () => getComments())

// State Create
const state = ref({
  content: null,
  post: null
})
const validate = (state) => {
  const errors = []
  if (!state.content) errors.push({ path: 'content', message: 'Vui lòng nhập nội dung bài viết' })
  return errors
}

const breadcrumb = computed(() => {
  const list = [{label: 'Diễn đàn', to: '/forum'}]
  if(post.value.category) list.push({ label: post.value.category.name, to: `/forum/category/${post.value.category.key}`})
  if(post.value.sub) list.push({ label: post.value.sub.name, to: `/forum/category/${post.value.category.key}?sub=${post.value.sub.key}`})
  return list
})

const scrollTop = () => {
  window.scrollTo(0, 0)
}

// Post
const getPost = async () => {
  try {
    loading.value.page = true
    const data = await useAPI('forum/public/post/key', {
      key: route.params._key
    })

    post.value = data
    page.value.post = data._id

    state.value.post = data._id
    state.value.content = null

    loading.value.page = false
    await getComments()
  }
  catch(e){
    loading.value.page = false
  }
}

// Comment
const getComments = async () => {
  try {
    loading.value.comment.list = true
    const data = await useAPI('forum/public/post/comment/list', JSON.parse(JSON.stringify(page.value)))

    comments.value = data.list
    page.value.total = data.total

    setTimeout(() => loading.value.comment.list = false, 700)
  }
  catch(e){
    loading.value.comment.list = false
  }
}

const createComment = async () => {
  try {
    loading.value.comment.create = true
    await useAPI('forum/public/post/comment/create', JSON.parse(JSON.stringify(state.value)))

    loading.value.comment.create = false
    modal.value.comment = false

    await getComments()
  }
  catch(e){
    loading.value.comment.create = false
  }
}

// Like
const updateLike = async (type) => {
  try {
    loading.value.like = true
    const data = await useAPI(`forum/public/post/like/${!!type ? 'create' : 'undo'}`, {
      post: post.value._id
    })

    post.value.liked = data
    loading.value.like = false
  }
  catch(e){
    loading.value.like = false
  }
}

getPost()
watch(() => authStore.isLogin, () => getPost())
</script>