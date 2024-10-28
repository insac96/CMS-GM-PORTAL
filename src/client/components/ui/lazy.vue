<template>
  <NuxtLazyHydrate when-visible @hydrated="onRender">
    <slot :render="render"></slot>
  </NuxtLazyHydrate>
</template>

<script setup>
const render = ref(false)
const onRender = () => {
  console.log('Render')
  render.value = true
}
</script>