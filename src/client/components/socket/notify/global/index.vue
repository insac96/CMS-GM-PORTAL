<template>
  <div class="NotifyGlobal bg-transparent backdrop-blur-xl shadow-xl rounded-lg">
    <SocketNotifyGlobalText class="h-full" />
  </div>
</template>

<style lang="sass">
.NotifyGlobal
  position: fixed
  top: calc(var(--header-size) + 14px)
  left: 50%
  -webkit-mask: linear-gradient(0deg, transparent, #000 40%)
  mask: linear-gradient(0deg, transparent, #000 40%)
  z-index: 5
  min-width: 300px
  max-width: 300px
  transform: translateX(-150px)
  @media (min-width: 1024px)
    min-width: 500px
    max-width: 500px
    transform: translateX(-250px)
</style>