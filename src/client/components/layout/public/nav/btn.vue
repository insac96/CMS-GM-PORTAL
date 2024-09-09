<template>
  <UiFlex>
    <UButton color="gray" size="md" icon="i-bx-menu-alt-left" class="lg:hidden" @click="open = true" />

    <USlideover v-model="open" side="left" :ui="{
      width: 'w-screen max-w-[var(--nav-size)]'
    }">
      <LayoutPublicNav /> 
    </USlideover>
  </UiFlex>
</template>

<script setup>
const open = ref(false)
</script>