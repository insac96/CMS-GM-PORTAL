<template>
  <UForm
    :validate="validate"
    :state="state"
    @submit="submit"
  >
    <UFormGroup label="Tài khoản" :hint="`${state.username ? state.username.length : 0}/15`" name="username">
      <UInput icon="i-bxs-user" v-model="state.username" />
    </UFormGroup>

    <UFormGroup label="Email" name="email">
      <UInput icon="i-bxs-envelope" v-model="state.email" />
    </UFormGroup>

    <UFormGroup label="Điện thoại" name="phone">
      <UInput icon="i-bxs-phone" v-model="state.phone" />
    </UFormGroup>

    <UFormGroup label="Mật khẩu" :hint="`${state.password ? state.password.length : 0}/15`" name="password">
      <UInput icon="i-bxs-lock" v-model="state.password" type="password" />
    </UFormGroup>

    <UiFlex justify="between" class="mt-6">
      <UiText pointer size="sm" color="gray" @click="emit('in')">Đăng nhập ngay ?</UiText>
      <UButton type="submit" :loading="loading.signup">Xác Nhận</UButton>
    </UiFlex>
  </UForm>
</template>

<script setup>
const configStore = useConfigStore()
const authStore = useAuthStore()
const emit = defineEmits(['done', 'in'])

const loading = ref({
  signup: false,
  start: false
})

const timewait = ref(10)
const timming = ref(undefined)

const state = ref({
  username: undefined,
  email: undefined,
  phone: undefined,
  password: undefined
})

const validate = (state) => {
  const errors = []
  if (!state.username) errors.push({ path: 'username', message: 'Vui lòng nhập đầy đủ' })
  else if (state.username.length < 6 || state.username.length > 12) errors.push({ path: 'username', message: 'Độ dài 6-12 ký tự' })
  else if (!!state.username.match(/\s/g)) errors.push({ path: 'username', message: 'Phát hiện khoảng cách' })
  else if (!(/^[a-z0-9]*$/g).test(state.username)) errors.push({ path: 'username', message: 'Phát hiện ký tự đặc biệt và viết hoa' })
  else if (!!state.username.includes('admin')
    || !!state.username.includes('smod')
    || !!state.username.includes('robot')
  ) errors.push({ path: 'username', message: 'Danh xưng không hợp lệ' })

  if (!state.email) errors.push({ path: 'email', message: 'Vui lòng nhập đầy đủ' })
  else if (!state.email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)) errors.push({ path: 'email', message: 'Định dạng không đúng' })

  if (!state.phone) errors.push({ path: 'phone', message: 'Vui lòng nhập đầy đủ' })
  else if (!state.phone.match(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g)) errors.push({ path: 'phone', message: 'Định dạng không đúng' })

  if (!state.password) errors.push({ path: 'password', message: 'Vui lòng nhập đầy đủ' })
  else if (state.password.length < 6 || state.password.length > 15) errors.push({ path: 'password', message: 'Độ dài 6-15 ký tự' })
  else if (!!state.password.match(/\s/g)) errors.push({ path: 'password', message: 'Phát hiện khoảng cách' })

  return errors
}

const startTimeWait = () => {
  timming.value = setInterval(() => {
    if(timewait.value == 0){
      clearInterval(timming.value)
      timewait.value = 0
    }
    else {
      timewait.value--
    }
  }, 1000)
}

const submit = async () => {
  try {
    loading.value.signup = true
    await useAPI('auth/sign/up', JSON.parse(JSON.stringify(state.value)))
    start()
  }
  catch (e) {
    loading.value.signup = false
  }
}

const start = async () => {
  try {
    loading.value.start = true
    const auth = await useAPI('auth/get')
    
    authStore.setAuth(auth)

    loading.value.start = false
    useTo().navigateToSSL('/thankyou')
  }
  catch(e){
    loading.value.start = false
  }
}
</script>