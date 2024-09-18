<template>
  <UiSlide :images="slideList" />
</template>

<script setup>
const props = defineProps(['review', 'banner'])

const slideList = computed(() => {
  if(!props.review && !props.banner) return ['/images/null.webp']

  if(!props.review || props.review.length == 0) {
    const list = []
    list.push(props.banner || '/images/null.webp')
    return list
  }

  return props.review
})
</script>