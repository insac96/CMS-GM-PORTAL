<template>
  <UForm :state="state" @submit="submit" v-if="!!authStore.isLogin && !!profile">
    <UFormGroup name="avatar" label="Ảnh đại diện">
      <UiUploadImage v-model="state.avatar">
        <template #default="{ select, loading }">
          <UInput icon="i-bxs-image" placeholder="Bấm vào đây để tải ảnh" :model-value="state.avatar" :loading="loading" :disabled="loading.edit" readonly @click="select"/>
        </template>
      </UiUploadImage>
    </UFormGroup>

    <UFormGroup name="facebook" label="Địa chỉ Facebook">
      <UInput v-model="state.social.facebook" />
    </UFormGroup>

    <UFormGroup name="zalo" label="Địa chỉ Zalo">
      <UInput v-model="state.social.zalo" />
    </UFormGroup>

    <UFormGroup name="telegram" label="Địa chỉ Telegram">
      <UInput v-model="state.social.telegram" />
    </UFormGroup>

    <UFormGroup name="tiktok" label="Địa chỉ Tiktok">
      <UInput v-model="state.social.tiktok" />
    </UFormGroup>

    <UiFlex justify="end" class="mt-4">
      <UButton type="submit" :loading="loading.edit">Xác Nhận</UButton>
    </UiFlex>
  </UForm>
</template>

<script setup>
const authStore = useAuthStore()
const profile = ref(undefined)

const loading = ref({
  profile: false,
  edit: false
})

const state = ref({
  avatar: null,
  social: {
    facebook: null,
    zalo: null,
    telegram: null,
    tiktok: null
  }
})

const submit = async () => {
  try {
    loading.value.edit = true
    await useAPI('auth/public/edit/profile', JSON.parse(JSON.stringify(state.value)))

    loading.value.edit = false
  }
  catch(e){
    loading.value.edit = false
  }
}

const getUser = async () => {
  try {
    loading.value.profile = true
    const data = await useAPI('user/public/profile', {})

    profile.value = data
    state.value.avatar = data.avatar
    state.value.social = Object.assign(state.value.social, data.social)
    loading.value.profile = false
  }
  catch(e){
    loading.value.profile = true
  }
}

onMounted(() => setTimeout(getUser, 1))
</script>

