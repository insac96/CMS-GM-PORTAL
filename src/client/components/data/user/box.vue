
<template>
  <div v-if="!!user && !loading" class="py-10">
    <UiFlex type="col" class="gap-2">
      <DataUserAvatar size="2xl" :user="user" class="mb-4" />
      <DataUserName :user="user" />
      <UiText color="gray" size="sm" weight="semibold" v-if="!!user.level && user.level.title" class="mb-1">{{ user.level.title }} Cảnh</UiText>
      <UBadge size="xs" variant="soft" class="px-3" :color="typeFormat[user.type]['color']">{{ typeFormat[user.type]['label'] }}</UBadge>
    </UiFlex>
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

const loading = ref(false)
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
    loading.value = false
  }
}

onMounted(() => setTimeout(getProfile, 1))
</script>