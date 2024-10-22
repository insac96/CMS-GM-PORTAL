<template>
  <div>
    <UiFlex class="gap-2 cursor-pointer" @click="view = true">
      <img :src="`/images/user/stone/${level}.webp`" width="12" height="12"/>
      <UiText :size="size" weight="semibold" :class="`capitalize UserName UserName--${level}`">{{ !!user ? user.username : 'Ẩn danh'}}</UiText>
    </UiFlex>

    <UModal v-model="view" :ui="{width: 'sm:max-w-[300px]'}">
      <DataUserBox :fetch-id="user._id" />
    </UModal>
  </div>
</template>

<script setup>
const props = defineProps({
  user: { type: Object },
  size: { type: String, default: 'sm' }
})

const view = ref(false)

const level = computed(() => {
  if(!props.user) return 1
  if(!props.user.level) return 1
  if(!props.user.type) return props.user.level.number || 1
  if(props.user.type == 100) return 11
  return props.user.level.number || 1
})
</script>

<style lang="sass">
.dark
  .UserName
    &--11
      --user-name-color: #869791
    &--10
      --user-name-color: #d62d6c
    &--9
      --user-name-color: #d97b22
    &--8
      --user-name-color: #bc15ce
    &--7
      --user-name-color: #0c64ad
    &--6
      --user-name-color: #8622ef
    &--5
      --user-name-color: #d97b22
    &--4
      --user-name-color: #2bced6
    &--3
      --user-name-color: #02ab96
    &--2
      --user-name-color: #47ae07
  .UserName
    color: #fff
    text-shadow: 0 0 2px var(--user-name-color), 0 0 5px var(--user-name-color), 0 0 10px var(--user-name-color), 0 0 15px var(--user-name-color)
</style>