<template>
  <UChip size="md" :show="!!news" @click="goToChat">
    <UButton
      class="relative p-1.5"
      icon="i-bx-chat"
      color="gray" square
    ></UButton>
  </UChip>
</template>

<script setup>
const { $socket } = useNuxtApp()
const news = ref(false)

const goToChat = () => {
  news.value = false
  navigateTo('/chat')
}

onMounted(() => {
  $socket.on('chat-single-push', (data) => {
    news.value = true
  })
})
</script>