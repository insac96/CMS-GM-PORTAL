
<template>
  <div>
    <DataEmpty v-if="!user || !!loading" :loading="loading" text="Không có thông tin" class="min-h-[300px]" />

    <div v-else class="rounded-lg pt-10 pb-6 px-6">
      <UiFlex type="col" justify="center" class="gap-3 mb-6 relative z-[3]">
        <DataUserAvatar size="xl" :user="user" class="mb-4" />
        <DataUserName :user="user" size="xl" />
      </UiFlex>

      <UiFlex type="col" class="gap-4 relative z-[3]">
        <UiFlex justify="between" class="w-full">
          <UiText weight="semibold" color="gray" size="xs">Chức vụ</UiText>
          <UBadge size="xs" variant="soft" class="px-3" :color="typeFormat[user.type]['color']">{{ typeFormat[user.type]['label'] }}</UBadge>
        </UiFlex>

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
    </div>
  </div>
</template>

<script setup>
const { toMoney } = useMoney()
const emit = defineEmits(['action', 'update:userData'])

const props = defineProps({
  fetchId: String,
  reload: Number,
  userData: Object
})

const typeFormat = {
  0: { label: 'MEMBER', color: 'gray' },
  1: { label: 'G-MOD', color: 'green' },
  2: { label: 'F-MOD', color: 'cyan' },
  100: { label: 'ADMIN', color: 'red' },
  99: { label: 'ROBOT', color: 'orange' }
}

const loading = ref(true)
const user = ref(undefined)
watch(() => props.reload, (val) => !!val && init())

const getProfile = async () => {
  try {
    if(!props.fetchId) return false

    loading.value = true
    const get = await useAPI('user/public/profile', {
      _id: props.fetchId
    })

    user.value = get
    emit('update:userData', get)
    setTimeout(() => loading.value = false, 700)
  }
  catch(e) {
    loading.value = true
  }
}

onMounted(() => setTimeout(getProfile, 1))
</script>