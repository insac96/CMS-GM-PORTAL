<template>
  <div class="Loadingloader"></div>
</template>

<style lang="sass">
.Loadingloader
  width: 35px
  aspect-ratio: 1
  --_g: no-repeat radial-gradient(farthest-side, #fff 94%, #fff)
  background: var(--_g) 0 0, var(--_g) 100% 0, var(--_g) 100% 100%, var(--_g) 0 100%
  background-size: 40% 40%
  animation: l38 .5s infinite

@keyframes l38
  100%
    background-position: 100% 0,100% 100%,0 100%,0 0
</style>