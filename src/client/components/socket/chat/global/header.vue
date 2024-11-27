<template>
  <UiFlex>
    <UButton color="gray" icon="i-bx-world" square class="lg:hidden" @click="open = true" />

    <USlideover v-model="open" side="right" :ui="{
      width: 'w-screen max-w-[var(--nav-right-size)]'
    }">
      <div class="h-full overflow-hidden">
        <SocketChatGlobal /> 
      </div>
    </USlideover>
  </UiFlex>
</template>

<script setup>
const open = ref(false)
</script>