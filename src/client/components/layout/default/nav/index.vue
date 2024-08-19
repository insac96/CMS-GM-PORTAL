<template>
  <div>
    <PlayBtn block class="mb-2" />

    <DataSupport class="mb-4" />

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
      
      <template #[i.slot] v-for="i in navItems" :key="i.slot">
        <UVerticalNavigation :links="i.children" @click="emit('to')"/>
      </template>
    </UAccordion>
  </div>
</template>

<script setup>
const emit = defineEmits(['to'])

const navItems = computed(() => {
  const list =  []

  return list
})
</script>