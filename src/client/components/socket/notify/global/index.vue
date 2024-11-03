<template>
  <Transition name="page">
    <UiFlex class="NotifyGlobal dark:bg-black/85 shadow-xl rounded-lg gap-2 px-2 h-[30px]" v-show="show">
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
  max-width: 300px
  transform: translate(-50%)
  @media (min-width: 1024px)
    max-width: 500px
</style>