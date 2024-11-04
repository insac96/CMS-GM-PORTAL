<template>
  <Transition name="page">
    <UiFlex class="NotifyGlobal bg-black ring-2 ring-primary-500 shadow-xl rounded-2xl gap-2 px-2 h-[30px]" v-show="show">
      <UiIcon name="i-bxs-megaphone" />
      <SocketNotifyGlobalText class="grow" @running="running" />
    </UiFlex>
  </Transition>
</template>

<script setup>
const show = ref(false)
const running = (data) => show.value = data
</script>

<style lang="sass">
.NotifyGlobal
  position: fixed
  top: calc(var(--header-size) + 10px)
  left: 50%
  z-index: 5
  transform: translate(-50%)
  max-width: calc(100vw - 64px)
</style>