<template>
  <Transition name="page">
    <UiFlex class="NotifyGlobal dark:bg-black/85 shadow-xl rounded-lg gap-2 pl-2 h-[30px]" v-show="show">
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
  top: calc(var(--header-size) + 14px)
  left: 50%
  z-index: 5
  min-width: 300px
  max-width: 300px
  transform: translateX(-150px)
  @media (min-width: 1024px)
    min-width: 500px
    max-width: 500px
    transform: translateX(-250px)
</style>