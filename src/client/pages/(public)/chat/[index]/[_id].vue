<template>
  <UiFlex type="col" class="absolute top-0 left-0 w-full h-full overflow-hidden" v-if="!loading.start && !!conversation">
    <UiFlex class="w-full lg:max-w-[700px] mx-auto p-4 pb-0" justify="between">
      <UButton icon="i-bx-left-arrow-alt" @click="navigateTo('/chat')" color="gray" size="xs">Quay lại</UButton>
      <!-- <UButton icon="i-bx-block" @click="useNotify().error('Tính năng sắp ra mắt')" color="rose" size="xs">Chặn</UButton> -->
    </UiFlex>

    <UiFlex class="w-full lg:max-w-[700px] mx-auto p-4 gap-4">
      <DataUserAvatar :user="conversation.to" size="md" v-if="conversation.from._id == authStore.profile._id" />
      <DataUserAvatar :user="conversation.from" size="md" v-else no-action />

      <UiFlex class="grow" justify="between">
        <div>
          <DataUserName :user="conversation.to" size="md" v-if="conversation.from._id == authStore.profile._id" no-action />
          <DataUserName :user="conversation.from" size="md" v-else no-action />

          <UiText class="text-sm select-none mt-1" weight="semibold" :color="conversation.to.online ? 'green' : 'rose'" v-if="conversation.from._id == authStore.profile._id">{{ conversation.to.online ? 'Online' : 'Offline' }}</UiText>
          <UiText class="text-sm select-none mt-1" weight="semibold" :color="conversation.from.online ? 'green' : 'rose'" v-else>{{ conversation.from.online ? 'Online' : 'Offline' }}</UiText>
        </div>

        <Loading size="20" v-if="loading.list"></Loading>
      </UiFlex>
    </UiFlex>

    <div class="grow w-full lg:max-w-[700px] mx-auto p-4 overflow-y-auto" ref="box">
      <UiFlex v-for="chat in listFormat" :key="chat._id" class="w-full py-0.5" :justify="authStore.profile._id == chat.user ? 'end' : 'start'">
        <div class="bg-gray-100 dark:bg-gray-800 py-2 px-3 rounded-r-2xl rounded-bl-2xl text-left max-w-[80%]" v-if="authStore.profile._id != chat.user">
          <UiText size="sm" v-html="chat.content || 'Không có nội dung'"></UiText>
        </div>

        <div class="bg-gray-100 dark:bg-gray-800 py-2 px-3 rounded-l-2xl rounded-br-2xl text-right max-w-[80%]" v-if="authStore.profile._id == chat.user">
          <UiText size="sm" v-html="chat.content || 'Không có nội dung'"></UiText>
        </div>
      </UiFlex>
    </div>

    <div class="w-full lg:max-w-[700px] mx-auto p-4">
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
definePageMeta({
  middleware: 'auth'
})

const { $socket } = useNuxtApp()
const authStore = useAuthStore()
const route = useRoute()

const page = ref({
  size: 20,
  skip: 0,
  current: 1,
  _id: route.params._id
})

const loading = ref({
  start: true,
  list: false,
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

const toScroll = async (event) => {
  if (event.target.scrollTop === 0) {
    if(!!loading.value.list) return

    const scrollHeightBefore = box.value.scrollHeight
    await getLazy(true)

    const scrollHeightAfter = box.value.scrollHeight
    box.value.scrollTop = scrollHeightAfter - scrollHeightBefore
    box.value.removeEventListener('scroll', toScroll)
    box.value.addEventListener('scroll', toScroll)
  }
}

const send = async () => {
  try {
    if(!state.value.text) return useNotify().error('Vui lòng nhập nội dung')
    if(state.value.text.length > 100) return useNotify().error('Nội dung không vượt quá 100 ký tự')

    loading.value.send = true
    const data = await useAPI('socket/public/chat-single/send', JSON.parse(JSON.stringify(state.value)))

    state.value.text = null
    list.value.push(data)
    page.value.skip = list.value.length
    loading.value.send = false
    
    setTimeout(() => toFocus(), 100)
    setTimeout(() => toBottom(), 100)
  }
  catch (e){
    loading.value.send = false
    setTimeout(() => toFocus(), 100)
  }
}

const getLazy = async () => {
  try {
    loading.value.list = true
    const data = await useAPI('socket/public/chat-single/id', JSON.parse(JSON.stringify(page.value)))

    list.value = list.value.concat(data.messages)
    conversation.value = data.conversation
    page.value.skip = list.value.length

    setTimeout(() => loading.value.list = false, 500)
  }
  catch(e){
    loading.value.list = false
  }
}

const getStart = async (type) => {
  try {
    loading.value.start = true
    const data = await useAPI('socket/public/chat-single/id', JSON.parse(JSON.stringify(page.value)))

    list.value = data.messages
    conversation.value = data.conversation
    page.value.skip = list.value.length

    loading.value.start = false

    setTimeout(() => {
      toBottom()
      box.value.addEventListener('scroll', toScroll)
    }, 200)
  }
  catch(e){
    loading.value.start = false
  }
}

onMounted(() => {
  setTimeout(getStart, 1)

  $socket.on('chat-single-push', (data) => {
    if(data.conversation.toString() != route.params._id.toString()) return
    list.value.push(data)
    page.value.skip = list.value.length
    setTimeout(() => toBottom(), 100)
  })
})

watch(() => authStore.isLogin, (val) => !val && navigateTo('/'))
</script>