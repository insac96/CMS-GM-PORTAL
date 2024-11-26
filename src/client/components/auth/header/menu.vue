<template>
  <UiFlex>
    <UPopover class="h-[32px] w-[32px]" :popper="{ strategy: 'absolute', placement: 'bottom-end' }" v-model:open="open">
      <UButton
        class="relative p-1.5"
        icon="i-bx-user"
        color="gray" square
      ></UButton>

      <template #panel>
        <UCard class="w-[300px] max-w-sreen overflow-hidden" :ui="{ body: { padding: 'p-0 sm:p-0'}, rounded: 'rounded-none'}">
          <DataUserBox :fetch-id="authStore.profile._id" :no-chat="true" />

          <UDivider />

          <UVerticalNavigation :links="menuUser" :ui="{ padding: 'py-2', divider: { wrapper: { base: 'p-0' }}}" />
        </UCard>
      </template>
    </UPopover>

    <UModal v-model="modal.edit.info" preventClose>
      <UiContent title="Chỉnh Sửa" sub="Cập nhật thông tin cá nhân" class="p-4" no-dot>
        <template #more>
          <UButton icon="i-bx-x" class="ml-auto" size="2xs" color="gray" square @click="modal.edit.info = false"></UButton>
        </template>
        <AuthEditProfile />
      </UiContent>
    </UModal>

    <UModal v-model="modal.edit.password" preventClose>
      <UiContent title="Bảo Mật" sub="Thay đổi mật khẩu" class="p-4" no-dot>
        <template #more>
          <UButton icon="i-bx-x" class="ml-auto" size="2xs" color="gray" square @click="modal.edit.password = false"></UButton>
        </template>
        
        <AuthEditPassword @done="modal.edit.password = false" />
      </UiContent>
    </UModal>

    <UModal v-model="modal.history.payment" :ui="{width: 'sm:max-w-[900px]'}">
      <DataPaymentHistory />
    </UModal>

    <UModal v-model="modal.history.game" :ui="{width: 'sm:max-w-[900px]'}">
      <DataGamePlayed />
    </UModal>

    <UModal v-model="modal.game.manager" :ui="{width: 'sm:max-w-[900px]'}">
      <ManageGameGM class="p-4" @to="modal.game.manager = false" @close="modal.game.manager = false" />
    </UModal>
  </UiFlex>
</template>

<script setup>
const { $socket } = useNuxtApp()
const authStore = useAuthStore()
const open = ref(false)
const modal = ref({
  edit: {
    info: false,
    password: false
  },
  history: {
    game: false,
    payment: false
  },
  game: {
    manager: false
  }
})

const logout = () => {
  $socket.emit('online-logout', authStore.profile._id)
  authStore.removeAuth()
}

const menuUser = computed(() => {
  const list = []
  if(!!authStore.isAdmin){
    list.push([{
      label: 'Quản trị viên',
      icon: 'i-bx-shield-quarter',
      click: () => navigateTo('/manage')
    }])
  }
  if(!!authStore.isAdmin || !!authStore.isGMod){
    list.push([{
      label: 'Quản lý trò chơi',
      icon: 'i-bx-server',
      click: () => modal.value.game.manager = true
    }])
  }

  return [
    ...list,
    [{
      label: 'Chỉnh sửa',
      icon: 'i-bx-edit',
      click: () => modal.value.edit.info = true
    },{
      label: 'Bảo mật',
      icon: 'i-bx-lock',
      click: () => modal.value.edit.password = true
    }], 
    [{
      label: 'Lịch sử chơi',
      icon: 'i-bx-history',
      click: () => modal.value.history.game = true
    },{
      label: 'Lịch sử nạp',
      icon: 'i-bx-credit-card',
      click: () => modal.value.history.payment = true
    }],
    [{
      label: 'Đăng xuất',
      icon: 'i-bx-log-out',
      click: () => logout()
    }]
  ]
})
</script>