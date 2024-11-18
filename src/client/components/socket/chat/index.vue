<template>
  <UiFlex class="w-full min-h-full max-h-full overflow-hidden" type="col">
    <UiFlex class="min-h-[var(--header-size)] max-h-[var(--header-size)] w-full border-b border-gray-100 dark:border-gray-800 px-2 gap-1">
      <USelectMenu placeholder="Kênh Thế Giới" icon="i-bxs-megaphone" class="grow" :options="[
        'Kênh Thế Giới'
      ]"/>

      <SocketOnline />
    </UiFlex>

    <div ref="box" id="BoxChatGlobal" class="w-full grow overflow-y-auto overflow-x-hidden py-4 h-0">
      <UiFlex type="col" class="gap-4 px-2">
        <UiFlex v-for="chat in listFormat" :key="chat._id" class="w-full">
          <!--User Chat-->
          <UiFlex class="w-full space-x-2" items="start" v-if="chat.type == 'USER'">
            <!-- Avatar -->
            <DataUserAvatar :user="chat.user" size="xs"/>
            
            <!-- Info -->
            <div class="text-left">
              <DataUserName :user="chat.user" class="mb-1.5" size="xs"/>

              <div class="bg-gray-100 dark:bg-gray-800 p-2 rounded-r-lg rounded-bl-lg text-left mb-2">
                <UiText size="sm" v-html="chat.content || 'Không có nội dung'"></UiText>
              </div>

              <UiFlex>
                <UiText color="gray"  class="leading-none mx-2 text-[0.7rem]" mini>{{ useDayJs().fromTime(chat.createdAt, null, true) }}</UiText>
                <UiText color="primary" class="leading-none mx-2 text-[0.7rem] cursor-pointer" mini @click="reply(chat.user)">Trả lời</UiText>
                <UiText color="rose" class="leading-none mx-2 text-[0.7rem] cursor-pointer" mini @click="del(chat._id)" v-if="!!authStore.isAdmin">Xóa</UiText>
              </UiFlex>
            </div>
          </UiFlex>

          <!--Notify Chat-->
          <UiFlex class="w-full px-4 text-center" justify="center" v-if="chat.type == 'NOTIFY'" >
            <UiText color="gray" size="xs" v-html="chat.content"></UiText>
          </UiFlex>
        </UiFlex>
      </UiFlex>
    </div>

    <div class="w-full border-t border-gray-100 dark:border-gray-800 p-2">
      <UForm :state="state" @submit="send">
        <UiFlex class="gap-1">
          <UInput 
            v-model="state.text" 
            :disabled="!!loading.send"
            :loading="!!loading.send" 
            :ui="{ color: { gray: { outline: 'ring-0 focus:ring-0' }} }"
            color="gray"
            variant="outline"
            :placeholder="!!authStore.isLogin ? 'Nhập nội dung...' : 'Vui lòng đăng nhập trước'" 
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
const box = ref()
const input = ref()
const list = ref(undefined)

const loading = ref({
  list: true,
  send: false
})

const listFormat = computed(() => {
  if(!list.value) return []
  return list.value.sort((a,b) => {
    return new Date(a.createdAt) - new Date(b.createdAt);
  })
})

const state = ref({
  text: null
})

const toFocus = () => {
  input.value.$refs.input.focus()
}

const toBottom = () => {
  box.value.scrollTo({ top: box.value.scrollHeight, behavior: 'smooth' })
}

const reply = (user) => {
  state.value.text = `@${user.username} `
  toFocus()
}

const del = async (_id) => {
  try {
    if(!authStore.isLogin) return
    if(!authStore.isAdmin) return
    await useAPI('socket/public/chat/del', { _id: _id })
    setTimeout(() => toFocus(), 100)
  }
  catch (e){
  }
}

const send = async () => {
  try {
    if(!authStore.isLogin) return useNotify().error('Vui lòng đăng nhập trước')
    if(!state.value.text) return useNotify().error('Vui lòng nhập nội dung')
    if(state.value.text.length > 100) return useNotify().error('Nội dung không vượt quá 100 ký tự')

    loading.value.send = true
    await useAPI('socket/public/chat/send', JSON.parse(JSON.stringify(state.value)))

    state.value.text = null
    loading.value.send = false
    setTimeout(() => toFocus(), 100)
  }
  catch (e){
    loading.value.send = false
    setTimeout(() => toFocus(), 100)
  }
}

const getList = async () => {
  try {
    loading.value.list = true
    const data = await useAPI('socket/public/chat/list')

    list.value = data
    loading.value.list = false
    setTimeout(() => toBottom(), 100)
  }
  catch {
    loading.value.list = false
  }
}

onMounted(() => {
  setTimeout(getList, 1)

  $socket.on('chat-global-push', (data) => {
    if(!list.value) list.value = []
    list.value.push(data)
    setTimeout(() => toBottom(), 100)
  })

  $socket.on('notify-global-push', (data) => {
    if(!list.value) list.value = []
    list.value.push({ type: 'NOTIFY', content: data })
    setTimeout(() => toBottom(), 100)
  })

  $socket.on('chat-global-del', (data) => {
    if(!list.value) return
    if(list.value.length == 0) return

    const index = list.value.findLastIndex(i => i._id == data)
    if(index < 0) return

    list.value.splice(index, 1)
  })
})
</script>