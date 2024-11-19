<template>
  <UiImg 
    :src="imgLink"
    :img-w="Number(size) * 2"
    :img-h="Number(size) * 2"
    w="1" h="1" 
    class="
      transition-all 
      rounded-2xl 
    "
    :style="{
      minWidth: size ? `${size}px` : null,
      minHeight: size ? `${size}px` : null,
      width: size ? `${size}px` : null,
      height: size ? `${size}px` : null,
      maxWidth: size ? `${size}px` : null,
      maxHeight: size ? `${size}px` : null,
    }"
  ></UiImg>
</template>

<script setup>
const props = defineProps({
  game: String,
  src: String,
  size: { type: [ String, Number, undefined ], default: 55 }
})

const imgLink = computed(() => {
  if(!!props.src){
    return `/items/${props.game}/${props.src}`
  }
  else {
    return null
  }
})
</script>