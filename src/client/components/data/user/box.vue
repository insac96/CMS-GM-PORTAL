
<template>
  <div>
    <DataEmpty v-if="!user || !!loading.load" :loading="loading.load" text="Không có thông tin" class="min-h-[300px]" />

    <div v-else class="rounded-2xl pt-10 pb-6 px-6">
      <UiFlex type="col" justify="center" class="gap-3 mb-6 relative z-[3]">
        <DataUserAvatar size="2xl" :user="user" class="mb-4" no-action />
        <DataUserName :user="user" size="xl" no-action />
      </UiFlex>

      <UiFlex type="col" class="gap-4 relative z-[3]">
        <UiFlex justify="between" class="w-full">
          <UiText weight="semibold" color="gray" size="xs">Chức vụ</UiText>
          <UBadge size="xs" variant="soft" class="px-3" :color="typeFormat[user.type]['color']">{{ typeFormat[user.type]['label'] }}</UBadge>
        </UiFlex>

        <!-- <UiFlex justify="between" class="w-full">
          <UiText weight="semibold" color="gray" size="xs">VIP</UiText>
          <UiText weight="semibold" size="xs">{{ !!vipFormat ? vipFormat.end : (authStore.profile._id == user._id ? 'Nâng VIP' : 'Không') }}</UiText>
        </UiFlex> -->

        <UiFlex justify="between" class="w-full">
          <UiText weight="semibold" color="gray" size="xs">Cảnh giới</UiText>
          <UiText weight="semibold" size="xs">{{ user.level.title || '...' }}</UiText>
        </UiFlex>

        <UiFlex justify="between" class="w-full">
          <UiText weight="semibold" color="gray" size="xs">Tu vi</UiText>
          <UiText weight="semibold" size="xs">{{ toMoney(user.currency.exp) }}</UiText>
        </UiFlex>

        <UiFlex justify="between" class="w-full">
          <UiText weight="semibold" color="gray" size="xs">Tài phú</UiText>
          <UiText weight="semibold" size="xs">{{ toMoney(user.currency.coin) }}</UiText>
        </UiFlex>
      </UiFlex>

      <UiFlex justify="center" class="mt-6 gap-1" v-if="!noChat">
        <UButton icon="i-bx-chat" block color="black" @click="goChatSingle" :loading="loading.chat" :disabled="!!loading.chat">Nhắn Tin</UButton>
      </UiFlex>
    </div>
  </div>
</template>

<script setup>
const { toMoney } = useMoney()
const emit = defineEmits(['close', 'update:userData'])
const authStore = useAuthStore()

const props = defineProps({
  fetchId: String,
  reload: Number,
  userData: Object,
  noChat: Boolean
})

const typeFormat = {
  0: { label: 'MEMBER', color: 'gray' },
  1: { label: 'G-MOD', color: 'green' },
  2: { label: 'F-MOD', color: 'cyan' },
  100: { label: 'ADMIN', color: 'red' },
  99: { label: 'ROBOT', color: 'orange' }
}

const loading = ref({
  load: true,
  chat: false
})
const user = ref(undefined)
watch(() => props.reload, (val) => !!val && init())

const vipFormat = computed(() => {
  if(!user.value) return null
  if(!user.value.vip) return null
  if(!user.value.vip.month || !user.value.vip.forever) return null
  if(user.value.vip.month.enable) return {
    type: 'month',
    end: useDayJs().displayTime(user.value.vip.month.end),
  }
  if(user.value.vip.forever.enable) return {
    type: 'forever',
    end: 'Trọn Đời',
  }
  return null
})

const goChatSingle = async () => {
  try {
    loading.value.chat = true
    const conversation = await useAPI('socket/public/chat-single/start', {
      to: user.value._id
    })

    navigateTo(`/chat/${conversation}`)
    emit('close')
    loading.value.chat = false
  }
  catch(e){
    loading.value.chat = false
  }
}

const getProfile = async () => {
  try {
    if(!props.fetchId) return false

    loading.value.load = true
    const get = await useAPI('user/public/profile', {
      _id: props.fetchId
    })

    user.value = get
    emit('update:userData', get)
    setTimeout(() => loading.value.load = false, 700)
  }
  catch(e) {
    loading.value.load = true
  }
}

onMounted(() => setTimeout(getProfile, 1))
</script>