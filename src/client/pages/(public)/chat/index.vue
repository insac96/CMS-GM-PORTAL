<template>
  <UiContent title="Cuộc Hội Thoại" sub="Danh sách các tin nhắn cá nhân" class="lg:max-w-[700px] mx-auto">
    <DataEmpty text="Không có cuộc hội thoại nào" :loading="loading.list" class="min-h-[300px]" v-if="!!loading.list || list.length == 0"/>

    <UiFlex v-else v-for="(item, i) in list" :key="i" class="py-2 md:gap-4 gap-2 cursor-pointer" @click="goToChat(item._id)">
      <DataUserAvatar :user="item.to" size="xs" v-if="item.from._id == authStore.profile._id" no-action />
      <DataUserAvatar :user="item.from" size="xs" v-else no-action />

      <div class="grow">
        <UiFlex justify="between">
          <DataUserName :user="item.to" size="sm" v-if="item.from._id == authStore.profile._id" no-action />
          <DataUserName :user="item.from" size="sm" v-else no-action />

          <UiText size="xs" color="gray">{{ useDayJs().fromTime(item.update) }}</UiText>
        </UiFlex>

        <UiText class="text-sm select-none mt-1" color="gray">
          {{ !!item.last ? item.last.content : 'Chưa có tin nhắn' }}
        </UiText>
      </div>
    </UiFlex>
  </UiContent>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})

const { $socket } = useNuxtApp()
const authStore = useAuthStore()
const loading = ref({
  list: true
})

const list = ref([])

const goToChat = async (_id) => {
  navigateTo(`/chat/${_id}`)
}

const getList = async () => {
  try {
    loading.value.list = true
    const data = await useAPI('socket/public/chat-single/list')

    list.value = data
    setTimeout(() => loading.value.list = false, 500)
  }
  catch(e){
    loading.value.list = false
  }
}

const update = async () => {
  try {
    const data = await useAPI('socket/public/chat-single/list')
    list.value = data
  }
  catch(e){
    
  }
}

onMounted(() => {
  setTimeout(getList, 1)
  $socket.on('chat-single-push', update)
})

watch(() => authStore.isLogin, (val) => !val && navigateTo('/'))
</script>