<template>
  <div ref="target">
    <slot :render="render"></slot>
  </div>
</template>

<script setup>
import { useIntersectionObserver } from '@vueuse/core'
const target = ref(null)
const targetIsVisible = ref(false)
const { stop } = useIntersectionObserver(
  target,
  ([{ isIntersecting }], observerElement) => {
    targetIsVisible.value = isIntersecting
  }
)
const render = ref(false)
watch(() => targetIsVisible.value, (val) => !!val && (render.value = true) && stop())
</script>