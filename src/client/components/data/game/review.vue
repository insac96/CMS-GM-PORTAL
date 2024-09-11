<template>
  <UiSlide :images="slideList" />
</template>

<script setup>
const props = defineProps(['review', 'banner'])

const slideList = computed(() => {
  if(!props.review && !props.banner) return ['/images/icon/empty.png']

  if(props.review == 0) {
    const list = []
    list.push(props.banner)
    return list
  }

  return game.value.images
})
</script>