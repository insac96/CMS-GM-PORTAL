<template>
  <UAccordion 
    :items="navItems" 
    :ui="{
      'item': { padding: 'pt-0 pb-2 pl-6' },
    }"
    multiple
  >
    <template #default="{item, open}">
      <UiFlex items="center" class="py-2 mb-2 cursor-pointer overflow-hidden select-none">
        <UiIcon :name="item.icon" size="5" :color="open ? 'primary' : 'gray'"/>
        <UiText 
          class="mx-4" 
          size="sm" 
          weight="semibold" 
          :color="open ? 'primary' : 'gray'"
          :text="item.label"
        />
        <UiIcon
          name="i-bx-chevron-right"
          size="5"
          :color="open ? 'primary' : 'gray'"
          class="ms-auto transform transition-transform duration-200"
          :class="[open && 'rotate-90']"
        />
      </UiFlex>
    </template>
    <template #tab-0><UVerticalNavigation :links="navItems[0].children" @click="emit('to')"/></template>
    <template #tab-1><UVerticalNavigation :links="navItems[1].children" @click="emit('to')"/></template>
    <template #tab-2><UVerticalNavigation :links="navItems[2].children" @click="emit('to')"/></template>
    <template #tab-3><UVerticalNavigation :links="navItems[3].children" @click="emit('to')"/></template>
    <template #tab-4><UVerticalNavigation :links="navItems[4].children" @click="emit('to')"/></template>
    <template #tab-5><UVerticalNavigation :links="navItems[5].children" @click="emit('to')"/></template>
  </UAccordion>
</template>

<script setup>
const runtimeConfig = useRuntimeConfig()
const emit = defineEmits(['to'])
const navItems = [
  {
    label: 'Quản lý',
    icon: 'i-bxs-grid-alt',
    defaultOpen: true,
    slot: 'tab-0',
    children: [
      { label: 'Tài khoản', to: '/manage/@eni/user' },
      { label: 'Chi tiêu', to: '/manage/@eni/spend' },
      { label: 'Nhật ký', to: '/manage/@eni/log' }, 
      { label: 'Cài đặt', to: '/manage/@eni/config' },
    ]
  },
  {
    label: 'Địa chỉ IP',
    icon: 'i-bxs-barcode',
    defaultOpen: true,
    slot: 'tab-1',
    children: [
      { label: 'Quản trị', to: '/manage/@eni/ip/admin' },
      { label: 'Thành viên', to: '/manage/@eni/ip/user' }
    ]
  },
  {
    label: 'Tin tức',
    icon: 'i-bx-news',
    defaultOpen: true,
    slot: 'tab-2',
    children: [
    { label: 'Danh mục', to: '/manage/@eni/news/category' }, 
    { label: 'Danh sách', to: '/manage/@eni/news' }, 
    ]
  },
  {
    label: 'Thanh toán',
    icon: 'i-bx-credit-card',
    defaultOpen: true,
    slot: 'tab-3',
    children: [
      { label: 'Kênh nạp', to: '/manage/@eni/gate' }, 
      { label: 'Nạp tiền', to: '/manage/@eni/payment' }
    ]
  },
  {
    label: 'Trò chơi',
    icon: 'i-bx-cube-alt',
    defaultOpen: true,
    slot: 'tab-4',
    children: [
      { label: 'Nền tảng', to: '/manage/@eni/game/platform' },
      { label: 'Thể loại', to: '/manage/@eni/game/category' },  
      { label: 'Game Tool', to: '/manage/@eni/game/tool' },
      // { label: 'Game Private', to: '/manage/@eni/game/private' },
    ]
  },
]

const openLink = (link) => {
  window.location.href = link
}
</script>