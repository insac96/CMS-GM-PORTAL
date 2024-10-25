<template>
  <UiFlex class="xl:hidden">
    <UButton icon="i-bx-menu-alt-left" @click="open = true" square color="gray" />

    <USlideover v-model="open" side="left" :ui="{
      width: 'w-screen max-w-xs'
    }">
      <UCard 
        class="flex flex-col flex-1 w-full" 
        :ui="{ 
          base: 'overflow-y-auto',
          body: { base: 'grow overflow-y-auto' },
          ring: '', 
          divide: 'divide-y divide-gray-100 dark:divide-gray-800'
        }"
      >
        <UiFlex class="w-full mb-6" justify="center">
          <NuxtLink to="/manage/@eni">
            <UiLogo @click="open = false" />
          </NuxtLink>
        </UiFlex>

        <LayoutManageNav @to="open = false"/>
      </UCard>
    </USlideover>
  </UiFlex>
</template>

<script setup>
const open = ref(false)
</script>