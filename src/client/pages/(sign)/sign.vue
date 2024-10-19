<template>
  <UiFlex type="col" justify="center" class="p-6 w-full min-h-screen">
    <UiContent 
      :title="tabItem == 0 ? 'Đăng Nhập' : 'Đăng Ký'" 
      :sub="tabItem == 0 ? 'Xác thực thông tin tài khoản' : 'Tạo tài khoản mới'"
      class="w-full"
      style="max-width: 350px;"
      no-dot
    >
      <template #more>
        <UiLogo class="ml-auto"/>
      </template>

      <LazyAuthSignIn v-if="tabItem == 0" @up="tabItem = 1" @done="navigateTo('/')"></LazyAuthSignIn>
      <LazyAuthSignUp v-if="tabItem == 1" @in="tabItem = 0" @done="navigateTo('/')"></LazyAuthSignUp>
    </UiContent>
  </UiFlex>
</template>

<script setup>
definePageMeta({
  layout: ''
})

const configStore = useConfigStore()
const tabItem = ref(0)

useSeoMeta({
  title: () => `${tabItem.value == 0 ? 'Đăng Nhập' : 'Đăng Ký'} - ${configStore.config.name}`,
  ogTitle: () => `${tabItem.value == 0 ? 'Đăng Nhập' : 'Đăng Ký'} - ${configStore.config.name}`,
  description: () => 'Xác thực tài khoản để truy cập không giới hạn',
  ogDescription: () => 'Xác thực tài khoản để truy cập không giới hạn',
})
</script>