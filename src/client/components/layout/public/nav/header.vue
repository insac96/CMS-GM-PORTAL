<template>
  <UiFlex>
    <UButton color="gray" icon="i-bx-menu-alt-left" square class="lg:hidden" @click="open = true" />

    <USlideover v-model="open" side="left" :ui="{
      width: 'w-screen max-w-[var(--nav-size)]'
    }">
      <UCard 
        class="flex flex-col flex-1" 
        :ui="{ 
          body: { base: 'flex grow overflow-hidden', padding: 'px-0 py-0 sm:p-0' },
          header: { padding: '' },
          ring: '', 
          divide: 'divide-y divide-gray-100 dark:divide-gray-800'
        }"
      >
        <LayoutPublicNav @to="open = false" /> 
      </UCard>
    </USlideover>
  </UiFlex>
</template>

<script setup>
const open = ref(false)
</script>