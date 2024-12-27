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
  </UAccordion>
</template>

<script setup>
const route = useRoute()
const emit = defineEmits(['to'])
const navItems = computed(() => {
  return [
    {
      label: 'Quản lý',
      icon: 'i-bxs-grid-alt',
      defaultOpen: true,
      slot: 'tab-0',
      children: [
        { label: 'Tin tức', to: `/manage/@collab/${route.params._code}/news` },
        { label: 'Tài khoản', to: `/manage/@collab/${route.params._code}/user` },
      ]
    },
    {
      label: 'Trò chơi',
      icon: 'i-bxs-cube-alt',
      defaultOpen: true,
      slot: 'tab-1',
      children: [
        { label: 'Trò chơi của tôi', to: `/manage/@collab/${route.params._code}/game` },
        { label: 'Game Private', to: `/manage/@collab/${route.params._code}/game/private` },
        { label: 'Game Tool', to: `/manage/@collab/${route.params._code}/game/tool` },
        { label: 'Game China', to: `/manage/@collab/${route.params._code}/game/china` },
      ]
    }
  ]
})
</script>