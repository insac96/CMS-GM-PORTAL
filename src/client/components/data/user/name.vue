<template>
  <UiFlex class="gap-1">
    <UiText :size="size" weight="semibold" :class="`capitalize UserName--${user.level.stone}`">{{ !!user ? user.username : 'Ẩn danh'}}</UiText>
    <img :src="`/images/user/stone/${!!user ? (user.level ? user.level.stone : 1) : 1}.webp`" width="12" height="12"/>
  </UiFlex>
</template>

<script setup>
const props = defineProps({
  user: { type: Object },
  size: { type: String, default: 'sm' }
})
</script>

<style lang="sass">
.UserName
  &--5
    color: #d97b22
    text-shadow: 0 0 11px #d97b22
  &--4
    color: #c023bd
    text-shadow: 0 0 11px #c023bd
  &--3
    color: #0499ad
    text-shadow: 0 0 11px #0499ad
  &--2
    color: #0499ad
    text-shadow: 0 0 11px #0499ad

.dark
  .UserName
    &--5
      color: #fff
      text-shadow: 0 0 2px #d97b22, 0 0 5px #d97b22, 0 0 10px #d97b22, 0 0 15px #d97b22
    &--4
      color: #fff
      text-shadow: 0 0 2px #c023bd, 0 0 5px #c023bd, 0 0 10px #c023bd, 0 0 15px #c023bd
    &--3
      color: #fff
      text-shadow: 0 0 2px #d92135, 0 0 5px #d92135, 0 0 10px #d92135, 0 0 15px #d92135
    &--2
      color: #fff
      text-shadow: 0 0 2px #0499ad, 0 0 5px #0499ad, 0 0 10px #0499ad, 0 0 15px #0499ad
</style>