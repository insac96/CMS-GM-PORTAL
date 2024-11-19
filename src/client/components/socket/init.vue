<template>

</template>

<script setup>
const authStore = useAuthStore()
const socketStore = useSocketStore()
const { $socket } = useNuxtApp()

onMounted(() => {
  // Online
  $socket.emit('online-join', !!authStore.isLogin ? authStore.profile._id : null)
  $socket.on('online', (data) => socketStore.updateOnline(data))
})
</script>