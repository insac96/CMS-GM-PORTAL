<template>
  <UiContent title="Cuộc Hội Thoại" sub="Danh sách các tin nhắn cá nhân" class="max-w-[700px] mx-auto">
    <UiFlex v-for="(item, i) in list" :key="i" class="py-2 md:gap-4 gap-2 cursor-pointer" @click="goToChat(item._id)">
      <DataUserAvatar :user="item.to" size="xs" v-if="item.from._id == authStore.profile._id" />
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
    loading.value.list = false
  }
  catch(e){
    loading.value.list = false
  }
}

getList()
</script>