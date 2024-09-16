<template>
  <div class="UiContent">
    <div class="UiContentHeader mb-4">
      <UiFlex class="gap-4">
        <UiText weight="bold" class="lg:text-lg">{{ title || '...' }}</UiText>
        <UiFlex class="UiContentDivider bg-gray-200" v-if="!noDot"></UiFlex>
        <slot name="more"></slot>
      </UiFlex>
      <UiText class="text-xs lg:text-sm" color="gray" v-if="sub">{{ sub }}</UiText>
    </div>

    <div>
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  sub: String,
  noDot: Boolean
})
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