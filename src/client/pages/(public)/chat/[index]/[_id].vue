<template>
  <UiFlex type="col" class="absolute top-0 left-0 w-full h-full overflow-hidden" v-if="!loading.list && !!conversation">
    <UiFlex class="w-full max-w-[700px] mx-auto p-4 pb-0" justify="between">
      <UButton icon="i-bx-left-arrow-alt" @click="navigateTo('/chat')" color="gray" size="xs">Quay lại</UButton>
      <!-- <UButton icon="i-bx-block" @click="useNotify().error('Tính năng sắp ra mắt')" color="rose" size="xs">Chặn</UButton> -->
    </UiFlex>

    <UiFlex class="w-full max-w-[700px] mx-auto p-4 md:gap-4 gap-2">
      <DataUserAvatar :user="conversation.to" size="md" v-if="conversation.from._id == authStore.profile._id" />
      <DataUserAvatar :user="conversation.from" size="md" v-else no-action />

      <div class="grow">
        <div>
          <DataUserName :user="conversation.to" size="md" v-if="conversation.from._id == authStore.profile._id" no-action />
          <DataUserName :user="conversation.from" size="md" v-else no-action />

          <UiText class="text-sm select-none mt-1" color="gray">Sẵn sàng</UiText>
        </div>
      </div>
    </UiFlex>

    <div class="grow w-full max-w-[700px] mx-auto p-4 overflow-y-auto" ref="box">
      <UiFlex v-for="chat in listFormat" :key="chat._id" class="w-full py-0.5" :justify="authStore.profile._id == chat.user ? 'end' : 'start'">
        <div class="bg-gray-100 dark:bg-gray-800 py-2 px-3 rounded-r-lg rounded-bl-lg text-left" v-if="authStore.profile._id != chat.user">
          <UiText size="sm" v-html="chat.content || 'Không có nội dung'"></UiText>
        </div>

        <div class="bg-gray-100 dark:bg-gray-800 py-2 px-3 rounded-l-lg rounded-br-lg text-right" v-if="authStore.profile._id == chat.user">
          <UiText size="sm" v-html="chat.content || 'Không có nội dung'"></UiText>
        </div>
      </UiFlex>
    </div>

    <div class="w-full max-w-[700px] mx-auto p-4">
      <UForm :state="state" @submit="send">
        <UiFlex class="gap-1">
          <UInput 
            v-model="state.text" 
            :disabled="!!loading.send"
            :loading="!!loading.send" 
            :ui="{ color: { gray: { outline: 'ring-0 focus:ring-0' }} }"
            color="gray"
            variant="outline"
            placeholder="Nhập nội dung..." 
            class="w-full" 
            size="sm"
            id="InputChatGlobal"
            ref="input"
          />

          <UButton type="submit" color="gray" icon="i-bxs-send" square />
        </UiFlex>
      </UForm>
    </div>
  </UiFlex>
</template>

<script setup>
const { $socket } = useNuxtApp()
const authStore = useAuthStore()
const route = useRoute()
const loading = ref({
  list: true,
  send: false,
})

const conversation = ref(undefined)
const list = ref([])

const listFormat = computed(() => {
  if(!list.value) return []
  return list.value.sort((a,b) => {
    return new Date(a.createdAt) - new Date(b.createdAt);
  })
})

const box = ref()
const input = ref()
const state = ref({
  conversation: route.params._id,
  text: null
})

const toFocus = () => {
  input.value.$refs.input.focus()
}

const toBottom = () => {
  box.value.scrollTo({ top: box.value.scrollHeight, behavior: 'smooth' })
}

const send = async () => {
  try {
    if(!state.value.text) return useNotify().error('Vui lòng nhập nội dung')
    if(state.value.text.length > 100) return useNotify().error('Nội dung không vượt quá 100 ký tự')

    loading.value.send = true
    const data = await useAPI('socket/public/chat-single/send', JSON.parse(JSON.stringify(state.value)))

    state.value.text = null
    loading.value.send = false
    list.value.push(data)
    setTimeout(() => toFocus(), 100)
    setTimeout(() => toBottom(), 100)
  }
  catch (e){
    loading.value.send = false
    setTimeout(() => toFocus(), 100)
  }
}

const getList = async () => {
  try {
    loading.value.list = true
    const data = await useAPI('socket/public/chat-single/id', {
      _id: route.params._id
    })

    list.value = data.messages
    conversation.value = data.conversation
    state.value.conversation = data.conversation._id

    loading.value.list = false
    setTimeout(() => toBottom(), 200)
  }
  catch(e){
    loading.value.list = false
  }
}

onMounted(() => {
  setTimeout(getList, 1)

  $socket.on('chat-single-push', (data) => {
    list.value.push(data)
    setTimeout(() => toBottom(), 100)
  })
})
</script>