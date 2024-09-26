<template>
  <UiFlex>
    <UDropdown :items="menuUser" :popper="{ placement: 'bottom-end' }">
      <UButton
        class="relative p-1.5"
        icon="i-bx-user"
        color="gray" square
      ></UButton>
    </UDropdown>

    <UModal v-model="modal.edit.info">
      <UiContent title="Chỉnh Sửa" sub="Cập nhật thông tin cá nhân" class="p-4">
        <template #more>
          <UButton icon="i-bx-x" class="ml-auto" size="sm" color="gray" square @click="modal.edit.info = false"></UButton>
        </template>
        <AuthEditProfile />
      </UiContent>
    </UModal>

    <UModal v-model="modal.edit.password">
      <UiContent title="Bảo Mật" sub="Thay đổi mật khẩu" class="p-4">
        <template #more>
          <UButton icon="i-bx-x" class="ml-auto" size="sm" color="gray" square @click="modal.edit.password = false"></UButton>
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

    <UModal v-model="modal.game.manage" :ui="{width: 'sm:max-w-[900px]'}">
      <ManageGameGM class="p-4" @to="modal.game.manage = false"/>
    </UModal>
  </UiFlex>
</template>

<script setup>
const authStore = useAuthStore()

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
    manage: false
  }
})

const menuUser = computed(() => {
  const list = []
  if(authStore.profile.type == 3){
    list.push([{
      label: 'Quản trị viên',
      icon: 'i-bx-shield-quarter',
      click: () => navigateTo('/manage')
    }])
  }
  if(authStore.profile.type > 1){
    list.push([{
      label: 'Quản lý trò chơi',
      icon: 'i-bx-server',
      click: () => modal.value.game.manage = true
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
      click: () => authStore.removeAuth()
    }]
  ]
})
</script>