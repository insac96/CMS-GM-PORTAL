<template>

</template>

<script setup>
const socketStore = useSocketStore()
const { $socket } = useNuxtApp()

onMounted(() => {
  // Online
  $socket.emit('online')
  $socket.on('online', (data) => {
    socketStore.updateOnline(data)
  })
})
</script>