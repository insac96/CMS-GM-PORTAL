<template>
  <div class="UiContent">
    <div class="UiContentHeader mb-4">
      <UiFlex class="gap-4">
        <UiText weight="bold" class="lg:text-lg">{{ title || '...' }}</UiText>
        <UiFlex class="UiContentDivider bg-gray-200 dark:bg-gray-800" v-if="!noDot"></UiFlex>
        <slot name="more"></slot>
      </UiFlex>
      
      <div v-if="sub">
        <UiText class="text-xs lg:text-sm inline" color="gray">{{ !showMore ? sub.slice(0, 100) : sub }}</UiText>
        <UiText class="text-xs lg:text-sm inline" color="gray" v-if="!showMore">...</UiText>
        <UiText class="text-xs lg:text-sm inline cursor-pointer" color="primary" v-if="!!sub && sub.length > 100" @click="showMore = !showMore">{{ !showMore ? 'Xem thêm' : 'Ẩn' }}</UiText>
      </div>
    </div>

    <div>
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: String,
  sub: String,
  noDot: Boolean
})

const showMore = ref(false)

const checkSub = () => {
  if(!props.sub) return showMore.value = true
  if(props.sub.length > 100) return showMore.value = false
  return showMore.value = true
}
checkSub()
</script>

<style lang="sass">
.UiContent
  .UiContentHeader
    position: relative
    .UiContentDivider
      position: relative
      width: 20%
      max-width: 120px
      height: 0.5px
      border-radius: 50%
      &::after
        content: ''
        position: absolute
        left: 8%
        width: 23px
        height: 9px
        border-radius: 20px
        background: rgb(var(--color-primary-500))
</style>